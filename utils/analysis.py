from typing import Dict
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
from scipy.optimize import curve_fit, minimize
from scipy.spatial.distance import squareform, pdist
from sklearn.linear_model import LinearRegression
from utils.parser import boundary_to_nan


def print_testacc(
    alldata: Dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    alldata = boundary_to_nan(alldata)
    for dom in domains:
        for cur in curricula:
            acc = np.nanmean(alldata[dom][cur]["resp_correct"][:, 400:], 1)
            if onlygood:
                acc = acc[
                    np.isnan(alldata[dom][cur]["resp_category"][:, 400:]).sum(1) < 50
                ]
                # acc = acc[acc>0.5]
                print(
                    "only good subjects (n={}): {}, {}: {:.2f}".format(
                        len(acc), dom, cur, np.nanmean(acc)
                    )
                )
            else:
                print(
                    "all subjects (n={}): {}, {}: {:.2f}".format(
                        len(acc), dom, cur, np.nanmean(acc)
                    )
                )


def print_ttest_acc(
    alldata: dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    for dom in domains:
        acc_blocked = np.nanmean(alldata[dom]["blocked"]["resp_correct"][:, 400:], 1)
        acc_interleaved = np.nanmean(
            alldata[dom]["interleaved"]["resp_correct"][:, 400:], 1
        )
        if onlygood:
            # acc_blocked = acc_blocked[acc_blocked>0.50]
            # acc_interleaved = acc_interleaved[acc_interleaved>0.50]
            acc_blocked = acc_blocked[
                np.isnan(alldata[dom]["blocked"]["resp_category"][:, 400:]).sum(1) < 50
            ]
            acc_interleaved = acc_interleaved[
                np.isnan(alldata[dom]["interleaved"]["resp_category"][:, 400:]).sum(1)
                < 50
            ]
            s, p = stats.ttest_ind(acc_blocked, acc_interleaved)
            print(
                "only good subjects: {}, blocked vs interleaved: p= {:.3f}".format(
                    dom, p
                )
            )
        else:
            s, p = stats.ttest_ind(acc_blocked, acc_interleaved)
            print("all subjects: {}, blocked vs interleaved: p= {:.3f}".format(dom, p))


def compute_choicemats(
    alldata: dict,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
) -> dict:
    """
    calculates choice matrices (proportions of 'accept' choices for each stimulus type)
    for all domains and curricula.
    creates separate set of choice matrix, only including above chance performing participants
    """
    choicemats = {}
    for dom in domains:
        choicemats[dom] = {}
        for cur in curricula:
            # set boundary trials in acc vector to nan
            alldata[dom][cur]["resp_correct"][
                alldata[dom][cur]["expt_category"] == 0
            ] = np.nan
            # create mask to include only subjects with acc > 50%
            # acc = np.nanmean(alldata[dom][cur]['resp_correct'][:,400:],1)
            #             mask = acc>0.50
            # mask: exlude participants who missed more than 1/4 of trials:
            mask = np.isnan(alldata[dom][cur]["resp_category"][:, 400:]).sum(1) < 50

            # populate choice matrix
            choicemats[dom][cur] = {}
            data = alldata[dom][cur]
            size_levels = np.unique(data["expt_size"])
            speed_levels = np.unique(data["expt_speed"])
            size = data["expt_size"][:, 400:]
            speed = data["expt_speed"][:, 400:]
            task = data["expt_context"][:, 400:]
            responses = data["resp_category"][:, 400:]

            cmat_a = np.empty((len(responses), len(size_levels), len(speed_levels)))
            cmat_b = np.empty((len(responses), len(size_levels), len(speed_levels)))
            for subj in range(len(responses)):
                for x, s1 in enumerate(size_levels):
                    for y, s2 in enumerate(speed_levels):
                        cmat_a[subj, x, y] = np.nanmean(
                            responses[
                                subj,
                                (size[subj, :] == s1)
                                & (speed[subj, :] == s2)
                                & (task[subj, :] == 1),
                            ]
                        )
                        cmat_b[subj, x, y] = np.nanmean(
                            responses[
                                subj,
                                (size[subj, :] == s1)
                                & (speed[subj, :] == s2)
                                & (task[subj, :] == 2),
                            ]
                        )
            choicemats[dom][cur]["task_a"] = cmat_a
            choicemats[dom][cur]["task_b"] = cmat_b
            choicemats[dom][cur]["task_a_good"] = cmat_a[mask]
            choicemats[dom][cur]["task_b_good"] = cmat_b[mask]
    return choicemats


def fit_sigmoid(x, y):
    """
    fits sigmoidal nonlinearity to some data
    returns best-fitting parameter estimates
    """
    # initial guesses for max, slope and inflection point
    theta0 = [0.0, 0.0, 0.0]
    popt, _ = curve_fit(
        sigmoid,
        x,
        y,
        theta0,
        method="dogbox",
        maxfev=1000,
        bounds=([0, -10, -10], [0.5, 10, 10]),
    )
    return popt


def fit_sigmoids_to_choices(
    choicemats: dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    """
    wrapper that loops over domains and curricula to fit sigmoids at single sub level
    returns dictionary with best-fitting parameters
    onlygood: fit only to participants who performed above chance (yes/no)
    """
    tasks = ["task_a", "task_b"]
    reldims = [0, 1]
    irreldims = [1, 0]
    if onlygood == True:
        tasks = [t + "_good" for t in tasks]
    betas = {}
    for dom in domains:
        betas[dom] = {}
        for cur in curricula:
            betas[dom][cur] = {}
            for it, task in enumerate(tasks):
                betas[dom][cur][task] = {"rel": [], "irrel": []}
                cmats = choicemats[dom][cur][task]
                for subj in range(len(cmats)):
                    # print(subj)

                    choice_rel = cmats[subj, :, :].mean(reldims[it])
                    choice_irrel = cmats[subj, :, :].mean(irreldims[it])
                    if not (
                        np.any(np.isnan(choice_rel)) or np.any(np.isnan(choice_irrel))
                    ):
                        try:
                            betas[dom][cur][task]["rel"].append(
                                fit_sigmoid(stats.zscore(np.arange(-2, 3)), choice_rel)
                            )
                        except:
                            print(choice_rel)
                        try:
                            betas[dom][cur][task]["irrel"].append(
                                fit_sigmoid(
                                    stats.zscore(np.arange(-2, 3)), choice_irrel
                                )
                            )
                        except:
                            print(choice_irrel)
                betas[dom][cur][task]["rel"] = np.asarray(betas[dom][cur][task]["rel"])
                betas[dom][cur][task]["irrel"] = np.asarray(
                    betas[dom][cur][task]["irrel"]
                )

    return betas


def gen_choicemodelrdms(monitor=False):
    """
    generates model rdms for analysis of choice patterns
    model1: factorised, one bound per task
    model2: linear, diagonal boundary
    """
    task_a = np.tile((np.array([0, 0, 0.5, 1, 1])), (5, 1))
    task_b = task_a.T
    x = np.fliplr(np.tril(np.ones((5, 5)))).flatten()
    x[4:-4:4] = 0.5
    task_d = x.reshape((5, 5))

    if monitor:
        f, axs = plt.subplots(1, 2, figsize=(10, 5))
        axs = axs.flatten()
        axs[0].imshow(task_a)
        axs[0].set(xlabel="speed", ylabel="size", title="task a")
        axs[1].imshow(task_b)
        axs[1].set(xlabel="speed", ylabel="size", title="task b")
        plt.suptitle("factorised model:", fontweight="bold")
        plt.tight_layout()

        f, axs = plt.subplots(1, 2, figsize=(10, 5))
        axs = axs.flatten()
        axs[0].imshow(task_d)
        axs[0].set(xlabel="speed", ylabel="size", title="task a")
        axs[1].imshow(task_d)
        axs[1].set(xlabel="speed", ylabel="size", title="task b")
        plt.suptitle("linear model:", fontweight="bold")
        plt.tight_layout()

    rdm = squareform(
        pdist(np.concatenate((task_a.flatten(), task_b.flatten()))[:, np.newaxis])
    )
    x_fact = stats.zscore(rdm[np.tril_indices(50, k=-1)].flatten())[:, np.newaxis]
    rdm = squareform(
        pdist(np.concatenate((task_d.flatten(), task_d.flatten()))[:, np.newaxis])
    )
    x_lin = stats.zscore(rdm[np.tril_indices(50, k=-1)].flatten())[:, np.newaxis]
    dmat = np.squeeze(np.array((x_fact, x_lin))).T
    return dmat


def stats_fit_choicerdms(
    choicemats: dict,
    onlygood: bool = True,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    """
    regresses participant's choice rdms against model rdms
    """
    tasks = ["task_a", "task_b"]
    if onlygood == True:
        tasks = [t + "_good" for t in tasks]

    dmat = gen_choicemodelrdms()
    betas = {}
    for dom in domains:
        betas[dom] = {}
        for cur in curricula:
            betas[dom][cur] = []
            cmats_a = choicemats[dom][cur][tasks[0]]
            cmats_b = choicemats[dom][cur][tasks[1]]
            for sub in range(len(cmats_a)):
                sub_rdm = squareform(
                    pdist(
                        np.concatenate(
                            (cmats_a[sub, :, :].flatten(), cmats_b[sub, :, :].flatten())
                        )[:, np.newaxis]
                    )
                )
                y = stats.zscore(sub_rdm[np.tril_indices(50, k=-1)].flatten())
                # instantiate linear model
                lr = LinearRegression()
                lr.fit(dmat, y)
                betas[dom][cur].append(np.asarray(lr.coef_))
            betas[dom][cur] = np.asarray(betas[dom][cur])
    return betas


def sigmoid(x, L, k, x0):
    """
    sigmoidal nonlinearity with three free parameters (lapse, slope, offset)
    """

    y = L + (1 - L * 2) / (1.0 + np.exp(-k * (x - x0)))
    return y


def scalar_projection(X, phi):
    """
    performs scalar projection of x onto y by angle phi
    """
    phi_bound = np.deg2rad(phi)
    phi_ort = phi_bound - np.deg2rad(90)
    y = X @ np.array([np.cos(phi_ort), np.sin(phi_ort)]).T
    return y


def angular_distance(target_ang, source_ang):
    target_ang = np.deg2rad(target_ang)
    source_ang = np.deg2rad(source_ang)
    return np.rad2deg(
        np.arctan2(np.sin(target_ang - source_ang), np.cos(target_ang - source_ang))
    )


def angular_bias(ref, est, task="a"):
    bias = angular_distance(est, ref)
    if task == "a":
        bias = -bias
    return bias


def objective_function(X, y_true):
    def loss(theta):
        return -np.sum(np.log(1.0 - np.abs(y_true - choice_model(X, theta)) + 1e-5))

    return loss


def choice_model(X, theta):
    """
    generates choice probability matrix
    free parameters: orientation of bound, slope, offset and lapse rate of sigmoidal transducer
    """
    # projection task a
    X1 = scalar_projection(X, theta[0])
    # projection task b
    X2 = scalar_projection(X, theta[1])

    # inputs to model
    X_in = np.concatenate((X1, X2))

    # pass through transducer:
    y_hat = sigmoid(X_in, theta[2], theta[3], theta[4])

    # return outputs
    return y_hat


def fit_choice_model(y_true):
    """
    fits choice model to data, using Nelder-Mead or L-BFGS-B algorithm
    """
    a, b = np.meshgrid(np.arange(-2, 3), np.arange(-2, 3))
    a = a.flatten()
    b = b.flatten()
    X = np.stack((a, b)).T
    theta_init = [90, 180, 0, 10, 0]
    theta_bounds = ((0, 360), (0, 360), (0, 0.5), (0, 20), (-1, 1))
    results = minimize(
        objective_function(X, y_true),
        theta_init,
        bounds=theta_bounds,
        method="L-BFGS-B",
    )

    return results.x


def fit_model_to_subjects(
    choicemats: dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    """
    wrapper for fit_choice_model
    loops over subjects, tasks, domains etc
    """
    tasks = ["task_a", "task_b"]
    if onlygood == True:
        tasks = [t + "_good" for t in tasks]
    thetas = {}
    for dom in domains:
        thetas[dom] = {}
        for cur in curricula:
            thetas[dom][cur] = {
                "bias_a": [],
                "bias_b": [],
                "lapse": [],
                "slope": [],
                "offset": [],
            }
            for sub in range(len(choicemats[dom][cur][tasks[0]])):
                cmat_a = choicemats[dom][cur][tasks[0]][sub, :, :]
                cmat_b = choicemats[dom][cur][tasks[1]][sub, :, :]
                cmats = np.concatenate((cmat_a.flatten(), cmat_b.flatten()))
                theta_hat = fit_choice_model(cmats)
                theta_hat[0] = angular_bias(theta_hat[0], 90, task="a")
                theta_hat[1] = angular_bias(theta_hat[1], 180, task="b")
                for idx, k in enumerate(thetas[dom][cur].keys()):
                    thetas[dom][cur][k].append(theta_hat[idx])
            for k in thetas[dom][cur].keys():
                thetas[dom][cur][k] = np.asarray(thetas[dom][cur][k])
    return thetas
