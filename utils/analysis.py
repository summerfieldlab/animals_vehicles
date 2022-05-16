from typing import Dict, List
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
from scipy.optimize import curve_fit, minimize
from scipy.spatial.distance import squareform, pdist
from sklearn.linear_model import LinearRegression
from scipy.stats import rankdata
from utils.parser import boundary_to_nan


def print_testacc(
    alldata: Dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
    whichtask: str = "base",
):
    """prints test accuracy

    Args:
        alldata (Dict): nested dict with participant data
        onlygood (bool, optional): only participants who missed less than 25% of test trials. Defaults to False.
        domains (list, optional): task domains. Defaults to ["animals", "vehicles"].
        curricula (list, optional): training curricula. Defaults to ["blocked", "interleaved"].
        whichtask (bool, optional): which test task (base vs transfer). Defaults to "base".
    """
    alldata = boundary_to_nan(alldata)
    print(f"** Accuracy on {whichtask} task **")
    for dom in domains:
        for cur in curricula:
            resp_correct = alldata[dom][cur]["resp_correct"][:, 400:]
            resp_category = alldata[dom][cur]["resp_category"][:, 400:]
            expt_domain_test = alldata[dom][cur]["expt_domain"][:, 400:]
            expt_domain_base = alldata[dom][cur]["expt_domain"][:, 0]
            task_mask = np.asarray(
                [
                    expt_domain_test[i, :] == expt_domain_base[i]
                    for i in range(len(expt_domain_base))
                ]
            )
            resp_correct = np.array(
                [
                    resp_correct[i, task_mask[i, :] == (whichtask == "base")]
                    for i in range(len(task_mask))
                ]
            )
            resp_category = np.array(
                [
                    resp_category[i, task_mask[i, :] == (whichtask == "base")]
                    for i in range(len(task_mask))
                ]
            )

            n_test = resp_correct.shape[1]

            acc = np.nanmean(resp_correct, 1)
            if onlygood:
                acc = acc[np.isnan(resp_category).sum(1) < (n_test / 4)]
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
    whichtask: str = "base",
):
    """performs ranksum test on test accuracy

    Args:
        alldata (Dict): nested dict with participant data
        onlygood (bool, optional): only participants who missed less than 25% of test trials. Defaults to False.
        domains (list, optional): task domains. Defaults to ["animals", "vehicles"].
        whichtask (bool, optional): which test task (base vs transfer). Defaults to "base".
    """
    print(f"** mann whitney u on {whichtask} task **")
    for dom in domains:
        n_test = alldata[dom]["blocked"]["resp_correct"][:, 400:].shape[1]

        resp_correct = alldata[dom]["blocked"]["resp_correct"][:, 400:]
        resp_category = alldata[dom]["blocked"]["resp_category"][:, 400:]
        expt_domain_test = alldata[dom]["blocked"]["expt_domain"][:, 400:]
        expt_domain_base = alldata[dom]["blocked"]["expt_domain"][:, 0]
        task_mask = np.asarray(
            [
                expt_domain_test[i, :] == expt_domain_base[i]
                for i in range(len(expt_domain_base))
            ]
        )
        resp_correct_blocked = np.array(
            [
                resp_correct[i, task_mask[i, :] == (whichtask == "base")]
                for i in range(len(task_mask))
            ]
        )
        resp_category_blocked = np.array(
            [
                resp_category[i, task_mask[i, :] == (whichtask == "base")]
                for i in range(len(task_mask))
            ]
        )

        resp_correct = alldata[dom]["interleaved"]["resp_correct"][:, 400:]
        resp_category = alldata[dom]["interleaved"]["resp_category"][:, 400:]
        expt_domain_test = alldata[dom]["interleaved"]["expt_domain"][:, 400:]
        expt_domain_base = alldata[dom]["interleaved"]["expt_domain"][:, 0]
        task_mask = np.asarray(
            [
                expt_domain_test[i, :] == expt_domain_base[i]
                for i in range(len(expt_domain_base))
            ]
        )
        resp_correct_interleaved = np.array(
            [
                resp_correct[i, task_mask[i, :] == (whichtask == "base")]
                for i in range(len(task_mask))
            ]
        )
        resp_category_interleaved = np.array(
            [
                resp_category[i, task_mask[i, :] == (whichtask == "base")]
                for i in range(len(task_mask))
            ]
        )

        acc_blocked = np.nanmean(resp_correct_blocked, 1)
        acc_interleaved = np.nanmean(resp_correct_interleaved, 1)
        if onlygood:
            acc_blocked = acc_blocked[
                np.isnan(resp_category_blocked).sum(1) < (n_test / 4)
            ]
            acc_interleaved = acc_interleaved[
                np.isnan(resp_category_interleaved).sum(1) < (n_test / 4)
            ]
            tval, p = stats.ttest_ind(acc_blocked, acc_interleaved)
            print(
                "only good subjects: {}, blocked vs interleaved: t({})= {:.3f}  p= {:.3f}".format(
                    dom, (len(acc_blocked) + len(acc_interleaved)), tval, p
                )
            )
        else:
            tval, p = stats.ttest_ind(acc_blocked, acc_interleaved)
            print(
                "all subjects: {}, blocked vs interleaved: t({})= {:.3f}  p= {:.3f}".format(
                    dom, (len(acc_blocked) + len(acc_interleaved)), tval, p
                )
            )


def compute_choicemats(
    alldata: dict,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
    whichtask: str = "base",
) -> dict:
    """calculates choice matrices (proportions of 'accept' choices for each stimulus type)
    for all domains and curricula.
    creates separate set of choice matrix, only including above chance performing participants

    Args:
        alldata (dict): participant data
        domains (list, optional): base task domains. Defaults to ["animals", "vehicles"].
        curricula (list, optional): training curricula. Defaults to ["blocked", "interleaved"].
        whichtask (str, optional): base vs tranfer task of test phase. Defaults to "base".

    Returns:
        dict: choice matrices per domain&curriculum
    """
    choicemats = {}
    for dom in domains:
        choicemats[dom] = {}
        for cur in curricula:
            # set boundary trials in acc vector to nan
            alldata[dom][cur]["resp_correct"][
                alldata[dom][cur]["expt_category"] == 0
            ] = np.nan

            # mask: exlude participants who missed more than 1/4 of trials:
            n_test = alldata[dom][cur]["resp_correct"][:, 400:].shape[1]
            resp_category = alldata[dom][cur]["resp_category"][:, 400:]
            mask = np.isnan(resp_category).sum(1) < (n_test / 4)

            # populate choice matrix
            choicemats[dom][cur] = {}
            data = alldata[dom][cur]
            size_levels = np.unique(data["expt_size"])
            speed_levels = np.unique(data["expt_speed"])
            size = data["expt_size"][:, 400:]
            speed = data["expt_speed"][:, 400:]
            task = data["expt_context"][:, 400:]
            responses = data["resp_category"][:, 400:]
            # pull out base or transfer task trials
            expt_domain_test = alldata[dom][cur]["expt_domain"][:, 400:]
            expt_domain_base = alldata[dom][cur]["expt_domain"][:, 0]
            task_mask = np.asarray(
                [
                    expt_domain_test[i, :] == expt_domain_base[i]
                    for i in range(len(expt_domain_base))
                ]
            )
            responses = np.array(
                [
                    resp_category[i, task_mask[i, :] == (whichtask == "base")]
                    for i in range(len(task_mask))
                ]
            )

            size = np.array(
                [
                    size[i, task_mask[i, :] == (whichtask == "base")]
                    for i in range(len(task_mask))
                ]
            )

            speed = np.array(
                [
                    speed[i, task_mask[i, :] == (whichtask == "base")]
                    for i in range(len(task_mask))
                ]
            )

            task = np.array(
                [
                    task[i, task_mask[i, :] == (whichtask == "base")]
                    for i in range(len(task_mask))
                ]
            )

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


def nolapse(func):
    """decorator for sigmoid_fourparmas to avoid fitting lapse rate"""

    def inner(x, L, k, x0):
        return func(x, L, k, x0, fitlapse=False)

    return inner


def sigmoid_fourparams(
    x: np.array, L: float, k: float, x0: float, fitlapse=True
) -> np.array:
    """sigmoidal non-linearity with four free params
    Args:
        x (np.array): inputs
        L (float): lapse rate
        k (float): slope
        x0 (float): offset
        fitlapse (bool, optional): fit lapse rate. Defaults to True.
    Returns:
        np.array: outputs of sigmoid
    """
    if fitlapse is False:
        L = 0
    y = L + (1 - L * 2) / (1.0 + np.exp(-k * (x - x0)))
    return y


def fit_sigmoid(x: np.array, y, fitlapse=True):
    """
    fits sigmoidal nonlinearity to some data
    returns best-fitting parameter estimates
    """
    # initial guesses for max, slope and inflection point
    theta0 = [0.0, 0.0, 0.0]
    if fitlapse is False:
        popt, _ = curve_fit(
            nolapse(sigmoid_fourparams),
            x,
            y,
            theta0,
            method="dogbox",
            maxfev=1000,
            bounds=([0, -10, -10], [0.5, 10, 10]),
        )
    else:
        popt, _ = curve_fit(
            sigmoid_fourparams,
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
    fitlapse: bool = False,
):
    """
    wrapper that loops over domains and curricula to fit sigmoids at single sub level
    returns dictionary with best-fitting parameters
    onlygood: fit only to participants who performed above chance (yes/no)
    fitlapse: whether or not to fit lapse rate
    """
    tasks = ["task_a", "task_b"]
    reldims = [0, 1]
    irreldims = [1, 0]
    if onlygood is True:
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
                                fit_sigmoid(
                                    stats.zscore(np.arange(-2, 3)),
                                    choice_rel,
                                    fitlapse=fitlapse,
                                )
                            )
                        except Exception:
                            print(choice_rel)
                        try:
                            betas[dom][cur][task]["irrel"].append(
                                fit_sigmoid(
                                    stats.zscore(np.arange(-2, 3)),
                                    choice_irrel,
                                    fitlapse=fitlapse,
                                )
                            )
                        except Exception:
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
        f, axs = plt.subplots(1, 2, figsize=(5, 2.5))
        axs = axs.flatten()
        axs[0].imshow(task_a)
        axs[0].set(xlabel="speed", ylabel="size", title="task a")
        axs[1].imshow(task_b)
        axs[1].set(xlabel="speed", ylabel="size", title="task b")
        plt.suptitle("factorised model:", fontweight="bold")
        plt.tight_layout()

        f, axs = plt.subplots(1, 2, figsize=(5, 2.5))
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
    if onlygood is True:
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
                y = sub_rdm[np.tril_indices(50, k=-1)].flatten()
                y = stats.zscore(y)
                # instantiate linear model
                lr = LinearRegression()
                try:
                    lr.fit(dmat, y)
                    betas[dom][cur].append(np.asarray(lr.coef_))
                except ValueError:
                    print(f"{dom} {cur} {sub}")
                    # print(y)

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


def fit_choice_model(y_true: np.array, n_runs=1) -> List:
    """fits choice model to data, using Nelder-Mead or L-BFGS-B algorithm
    Args:
        y_true (np.array): labels
        n_runs (int, optional): number of runs. Defaults to 1.
    Returns:
        List: estimated parameters
    """

    assert n_runs > 0

    a, b = np.meshgrid(np.arange(-2, 3), np.arange(-2, 3))
    a = a.flatten()
    b = b.flatten()
    X = np.stack((a, b)).T
    theta_bounds = ((0, 360), (0, 360), (0, 0.5), (0, 20), (-1, 1))
    if n_runs == 1:
        theta_init = [90, 180, 0, 2, 0]
        results = minimize(
            objective_function(X, y_true),
            theta_init,
            bounds=theta_bounds,
            method="L-BFGS-B",
        )
        return results.x
    elif n_runs > 1:
        theta_initbounds = ((80, 100), (170, 190), (0, 0.1), (14, 16), (-0.02, 0.02))
        thetas = []
        for i in range(10):
            theta_init = [
                np.round(np.random.uniform(a[0], a[1]), 2) for a in theta_initbounds
            ]
            results = minimize(
                objective_function(X, y_true),
                theta_init,
                bounds=theta_bounds,
                method="L-BFGS-B",
            )
            thetas.append(results.x)

        return np.mean(np.array(thetas), 0)


def fit_model_to_subjects(
    choicemats: dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
    n_runs: int = 1,
):
    """
    wrapper for fit_choice_model
    loops over subjects, tasks, domains etc
    """
    tasks = ["task_a", "task_b"]
    if onlygood is True:
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
                theta_hat = fit_choice_model(cmats, n_runs)
                theta_hat[0] = angular_bias(theta_hat[0], 90, task="a")
                theta_hat[1] = angular_bias(theta_hat[1], 180, task="b")
                for idx, k in enumerate(thetas[dom][cur].keys()):
                    thetas[dom][cur][k].append(theta_hat[idx])
            for k in thetas[dom][cur].keys():
                thetas[dom][cur][k] = np.asarray(thetas[dom][cur][k])
    return thetas


def arena_compute_rdms(
    alldata: dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
) -> dict:
    """computes rdms based on rating task data

    Args:
        alldata (dict): nested dict with participant data
        onlygood (bool, optional): only participants who missed less than 25% of test trials. Defaults to False.
        domains (list, optional): task domains. Defaults to ["animals", "vehicles"].
        curricula (list, optional): training curricula. Defaults to ["blocked", "interleaved"].

    Returns:
        dict: nested dict with arena results per domain/curriculum. one rdm per participant per trial

    """
    rdms = {}
    for dom in domains:
        rdms[dom] = {}
        for cur in curricula:
            # set boundary trials in acc vector to nan
            alldata[dom][cur]["resp_correct"][
                alldata[dom][cur]["expt_category"] == 0
            ] = np.nan

            # mask: exlude participants who missed more than 1/4 of trials:
            n_test = alldata[dom][cur]["resp_correct"][:, 400:].shape[1]
            resp_category = alldata[dom][cur]["resp_category"][:, 400:]
            mask = np.isnan(resp_category).sum(1) < (n_test / 4)

            # populate choice matrix
            rdms[dom][cur] = {}
            data = alldata[dom][cur]

            # loop over subjects and trials
            n_participants = data["arena_trial"].shape[0]
            n_trials = np.max(data["arena_trial"][0, :])
            rdm_set = np.empty((n_participants, n_trials, 25, 25))
            for participant in range(n_participants):
                for trial in range(1, n_trials + 1):
                    coords = data["arena_coords"][
                        participant, data["arena_trial"][participant, :] == trial
                    ]
                    assert len(coords) == 25
                    assert len(coords.T) == 2
                    dists = pdist(coords)
                    rdm = squareform(dists)
                    # perhaps normalise by max distance
                    rdm = rankdata(rdm).reshape((25, 25))
                    rdm_set[participant, trial - 1, :, :] = rdm
            rdms[dom][cur] = rdm_set[mask, :, :, :]

    return rdms
