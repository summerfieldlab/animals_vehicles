import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# from utils.analysis import fit_sigmoid, sigmoid


def sem(x: np.array, ddof: int = 1, ax: int = 0) -> float:
    """computes standard error of mean

    Args:
        x (np.array): array with some data
        ddof (int, optional): degrees of freedom for std estimation. Defaults to 1.
        ax (int, optional): axis of x along which to compte sem. Defaults to 0.

    Returns:
        float: sem of x
    """
    return np.std(x, ddof=1, axis=ax) / np.sqrt(np.shape(x)[ax])


def disp_accuracy(alldata, domain, whichtask="base"):

    # set boundary trials to nan
    alldata[domain]["blocked"]["resp_correct"][
        alldata[domain]["blocked"]["expt_category"] == 0
    ] = np.nan
    alldata[domain]["interleaved"]["resp_correct"][
        alldata[domain]["interleaved"]["expt_category"] == 0
    ] = np.nan

    # compute accuracies
    n_test = alldata[domain]["blocked"]["resp_correct"][:, 400:].shape[1]

    resp_correct = alldata[domain]["blocked"]["resp_correct"][:, 400:]
    resp_category = alldata[domain]["blocked"]["resp_category"][:, 400:]
    expt_domain_test = alldata[domain]["blocked"]["expt_domain"][:, 400:]
    expt_domain_base = alldata[domain]["blocked"]["expt_domain"][:, 0]
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

    resp_correct = alldata[domain]["interleaved"]["resp_correct"][:, 400:]
    resp_category = alldata[domain]["interleaved"]["resp_category"][:, 400:]
    expt_domain_test = alldata[domain]["interleaved"]["expt_domain"][:, 400:]
    expt_domain_base = alldata[domain]["interleaved"]["expt_domain"][:, 0]
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
    f, ax = plt.subplots(1, 2, figsize=(10, 5))
    ax = ax.ravel()
    # all participants
    ax[0].bar(
        [0, 1],
        [acc_blocked.mean(), acc_interleaved.mean()],
        yerr=[sem(acc_blocked), sem(acc_interleaved)],
        zorder=1,
        color=[[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]],
    )
    # ax[0].scatter(np.zeros(len(acc_blocked)) - 0.1, acc_blocked, zorder=3, color="k")
    # ax[0].scatter(
    #     np.ones(len(acc_interleaved)) - 0.1, acc_interleaved, zorder=3, color="k"
    # )
    ax[0].spines["top"].set_visible(False)
    ax[0].spines["right"].set_visible(False)
    ax[0].set_xticks([0, 1])
    ax[0].set_xticklabels(["blocked", "interleaved"])
    ax[0].set_ylim([0.5, 1])
    ax[0].set_yticks(np.arange(0, 1.1, 0.25))
    ax[0].set_yticklabels(np.arange(0, 101, 25))
    ax[0].set_ylim([0.5, 1])
    ax[0].set_ylabel("Accuracy (%)")
    ax[0].set_title("all participants")

    # only if meets inclusion criterion (less than 1/4 of trials missed)
    acc_blocked_good = acc_blocked[
        np.isnan(resp_category_blocked).sum(1) < (n_test / 4)
    ]
    acc_interleaved_good = acc_interleaved[
        np.isnan(resp_category_interleaved).sum(1) < (n_test / 4)
    ]
    ax[1].bar(
        [0, 1],
        [acc_blocked_good.mean(), acc_interleaved_good.mean()],
        yerr=[sem(acc_blocked_good), sem(acc_interleaved_good)],
        zorder=1,
        color=[[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]],
    )
    # ax[1].scatter(np.zeros(len(acc_blocked_good))-0.1,acc_blocked_good,zorder=3,color='k')
    # ax[1].scatter(np.ones(len(acc_interleaved_good))-0.1,acc_interleaved_good,zorder=3,color='k')
    ax[1].spines["top"].set_visible(False)
    ax[1].spines["right"].set_visible(False)
    ax[1].set_xticks([0, 1])
    ax[1].set_xticklabels(["blocked", "interleaved"])
    ax[1].set_ylim([0.5, 1])
    ax[1].set_yticks(np.arange(0, 1.1, 0.25))
    ax[1].set_yticklabels(np.arange(0, 101, 25))
    ax[1].set_ylim([0.5, 1])
    ax[1].set_ylabel("Accuracy (%)")
    ax[1].set_title("only < 1/4 of trials missed")
    plt.suptitle("test accuracy - " + domain)

    plt.tight_layout()


def disp_lcurves_training(
    alldata,
    domains=["animals", "vehicles"],
    curricula=["blocked", "interleaved"],
    onlygood=True,
):

    w = 50

    cols = [[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]]
    if onlygood is False:
        # all participants
        plt.figure(figsize=(15, 5))
        for i, dom in enumerate(domains):
            plt.subplot(1, 2, i + 1)
            for j, cur in enumerate(curricula):
                data_binned = np.array([])
                responses = alldata[dom][cur]["resp_correct"][:, :400]
                idces = np.arange(0, 400, w)
                data_binned = np.empty((responses.shape[0], len(idces)))
                for ii, idx in enumerate(idces):
                    data_binned[:, ii] = np.nanmean(responses[:, idx : idx + w - 1], 1)
                plt.errorbar(
                    np.arange(len(idces)),
                    data_binned.mean(0),
                    yerr=sem(data_binned, 0),
                    color=cols[j],
                    linewidth=2,
                    fmt="o-",
                )
            plt.ylim((0, 1))
            ax = plt.gca()
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)
            plt.title("learning curve - " + dom)
            plt.plot([4, 4], [0, 1], "k--")
            # plt.plot([8, 8], [0, 1], "k-")
            ticks = plt.xticks()
            plt.xticks(
                ticks=ticks[0], labels=[""] + [str(i) for i in np.arange(0, 401, 50)]
            )
            plt.xlim((-1, 8))
            plt.xlabel("trial")
            plt.ylabel("Accuracy (%)")
            ax = plt.gca()
            ax.set_ylim([-0.05, 1])
            ax.set_yticks(np.arange(0, 1.1, 0.25))
            ax.set_yticklabels(np.arange(0, 101, 25))
        plt.suptitle("All participants, training")
    else:
        # learning curve, good ones
        plt.figure(figsize=(15, 5))
        for i, dom in enumerate(domains):

            mask_blocked = (
                np.isnan(alldata[dom]["blocked"]["resp_category"][:, 400:]).sum(1) < 75
            )
            mask_interleaved = (
                np.isnan(alldata[dom]["interleaved"]["resp_category"][:, 400:]).sum(1)
                < 75
            )

            masks = [mask_blocked, mask_interleaved]
            plt.subplot(1, 2, i + 1)
            for j, cur in enumerate(curricula):
                data_binned = np.array([])
                responses = alldata[dom][cur]["resp_correct"][:, :400]
                idces = np.arange(0, 400, w)
                data_binned = np.empty((responses.shape[0], len(idces)))
                for ii, idx in enumerate(idces):
                    data_binned[:, ii] = np.nanmean(responses[:, idx : idx + w - 1], 1)
                data_binned = data_binned[masks[j], :]
                plt.errorbar(
                    np.arange(len(idces)),
                    data_binned.mean(0),
                    yerr=sem(data_binned, 0),
                    color=cols[j],
                    linewidth=2,
                    fmt="o-",
                )
            plt.ylim((0, 1))
            ax = plt.gca()
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)
            plt.title("learning curve - " + dom)
            plt.plot([4, 4], [0, 1], "k--")
            # plt.plot([8, 8], [0, 1], "k-")
            ticks = plt.xticks()
            plt.xticks(
                ticks=ticks[0], labels=[""] + [str(i) for i in np.arange(0, 401, 50)]
            )
            plt.xlim((-1, 8))
            plt.xlabel("trial")
            plt.ylabel("Accuracy (%)")
            ax = plt.gca()
            ax.set_ylim([-0.05, 1])
            ax.set_yticks(np.arange(0, 1.1, 0.25))
            ax.set_yticklabels(np.arange(0, 101, 25))
            plt.ylim((0.5, 1))
        plt.suptitle("only good participants, training")


def disp_lcurves_test(
    alldata,
    domains=["animals", "vehicles"],
    curricula=["blocked", "interleaved"],
    onlygood=True,
    whichtask="base",
):

    w = 25

    cols = [[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]]
    if onlygood is False:
        # all participants
        plt.figure(figsize=(15, 5))
        for i, dom in enumerate(domains):
            plt.subplot(1, 2, i + 1)
            for j, cur in enumerate(curricula):
                data_binned = np.array([])
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
                idces = np.arange(0, 150, w)
                data_binned = np.empty((resp_correct.shape[0], len(idces)))
                for ii, idx in enumerate(idces):
                    data_binned[:, ii] = np.nanmean(
                        resp_correct[:, idx : idx + w - 1], 1
                    )
                plt.errorbar(
                    np.arange(len(idces)),
                    data_binned.mean(0),
                    yerr=sem(data_binned, 0),
                    color=cols[j],
                    linewidth=2,
                    fmt="o-",
                )
            plt.ylim((0, 1))
            ax = plt.gca()
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)
            plt.title("learning curve - " + dom)
            # ticks = plt.xticks()
            plt.xticks(
                ticks=np.arange(7), labels=[str(i) for i in np.arange(0, 151, 25)]
            )
            # plt.xlim((-1, 8))
            plt.xlabel("trial")
            plt.ylabel("Accuracy (%)")
            ax = plt.gca()
            ax.set_ylim([-0.05, 1])
            ax.set_yticks(np.arange(0, 1.1, 0.25))
            ax.set_yticklabels(np.arange(0, 101, 25))
        plt.suptitle(f"All participants, test, {whichtask} task")
    else:
        # learning curve, good ones
        plt.figure(figsize=(15, 5))
        for i, dom in enumerate(domains):

            plt.subplot(1, 2, i + 1)
            for j, cur in enumerate(curricula):
                data_binned = np.array([])
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
                mask = np.isnan(resp_category).sum(1) < (n_test / 4)
                idces = np.arange(0, 150, w)
                data_binned = np.empty((resp_correct.shape[0], len(idces)))
                for ii, idx in enumerate(idces):
                    data_binned[:, ii] = np.nanmean(
                        resp_correct[:, idx : idx + w - 1], 1
                    )
                data_binned = data_binned[mask, :]
                plt.errorbar(
                    np.arange(len(idces)),
                    data_binned.mean(0),
                    yerr=sem(data_binned, 0),
                    color=cols[j],
                    linewidth=2,
                    fmt="o-",
                )
            plt.ylim((0, 1))
            ax = plt.gca()
            ax.spines["top"].set_visible(False)
            ax.spines["right"].set_visible(False)
            plt.title("learning curve - " + dom)

            # ticks = plt.xticks()
            plt.xticks(
                ticks=np.arange(7), labels=[str(i) for i in np.arange(0, 151, 25)]
            )
            # plt.xlim((-1, 8))
            plt.xlabel("trial")
            plt.ylabel("Accuracy (%)")
            ax = plt.gca()
            ax.set_ylim([-0.05, 1])
            ax.set_yticks(np.arange(0, 1.1, 0.25))
            ax.set_yticklabels(np.arange(0, 101, 25))
            plt.ylim((0.5, 1))
        plt.suptitle(f"only good participants, test, {whichtask} task")


def disp_lcurves(
    alldata,
    domains=["animals", "vehicles"],
    curricula=["blocked", "interleaved"],
    onlygood=True,
):

    disp_lcurves_training(
        alldata,
        domains=domains,
        curricula=curricula,
        onlygood=onlygood,
    )


def disp_sigmoid_fits(
    choicemats,
    thetas,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    """
    displays gt data of participant choices together with best fitting sigmoids
    onlygood: fit only to participants who performed above chance (yes/no)
    """

    tasks = ["task_a", "task_b"]
    if onlygood is True:
        tasks = [t + "_good" for t in tasks]
    task_labels = ["blue store (speed)", "orange store (size)"]
    cols = [[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]]
    reldims = [0, 1]
    irreldims = [1, 0]
    # one figure per domain
    for dom in domains:
        f, axs = plt.subplots(1, 2, figsize=(15, 7))
        axs = axs.ravel()
        for icol, cur in enumerate(curricula):
            for itask, task in enumerate(tasks):
                ax = axs[itask]
                choice_rel = choicemats[dom][cur][task].mean(reldims[itask] + 1)
                # params_rel = np.nanmean(betas[dom][cur][task]['rel'],0)
                # params_rel = np.nanmean(thetas[dom][cur][task]["rel"],0)
                # params_rel = fit_sigmoid(
                #     np.arange(-2, 3), np.nanmean(choice_rel, 0), fitlapse=False
                # )
                ax.errorbar(
                    np.arange(-2, 3),
                    np.nanmean(choice_rel, 0),
                    yerr=sem(choice_rel, 0),
                    fmt="o-",
                    color=cols[icol],
                )
                ax.scatter(
                    np.arange(-2, 3),
                    np.nanmean(choice_rel, 0),
                    s=60,
                    marker="o",
                    color=cols[icol],
                )
                # ax.plot(
                #     np.linspace(-2, 2, 100),
                #     sigmoid(
                #         np.linspace(-2, 3, 100),
                #         params_rel[0],
                #         params_rel[1],
                #         params_rel[2],
                #     ),
                #     color=cols[icol],
                # )

                choice_irrel = choicemats[dom][cur][task].mean(irreldims[itask] + 1)
                # params_irrel = np.nanmean(thetas[dom][cur][task]["irrel"], 0)
                # params_irrel = fit_sigmoid(
                #     np.arange(-2, 3), np.nanmean(choice_irrel, 0), fitlapse=False
                # )
                ax.errorbar(
                    np.arange(-2, 3),
                    np.nanmean(choice_irrel, 0),
                    yerr=sem(choice_irrel, 0),
                    fmt="x--",
                    color=cols[icol],
                )
                ax.scatter(
                    np.arange(-2, 3),
                    np.nanmean(choice_irrel, 0),
                    s=60,
                    marker="x",
                    color=cols[icol],
                )
                # ax.plot(
                #     np.linspace(-2, 2, 100),
                #     sigmoid(
                #         np.linspace(-2, 3, 100),
                #         params_irrel[0],
                #         params_irrel[1],
                #         params_irrel[2],
                #     ),
                #     color=cols[icol],
                #     linestyle="--",
                # )
                ax.set(ylim=[0, 1], xlim=[-2.2, 2.2])
                ax.set_title(
                    "".join([dom + " - " + task_labels[itask]]),
                    fontsize=12,
                    fontweight="bold",
                )
                ax.spines["top"].set_visible(False)
                ax.spines["right"].set_visible(False)
                ax.set(xlabel="feature value", ylabel="p(accept)")


def disp_param_estimates(
    betas,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    """
    displays average parameter estimates of sigmoid fit procedure
    onlygood: fit only to participants who performed above chance (yes/no)
    """

    tasks = ["task_a", "task_b"]
    if onlygood is True:
        tasks = [t + "_good" for t in tasks]
    # task_labels = ["blue store (speed)", "orange store (size)"]
    parameters = ["lapse rate", "slope", "offset"]
    dimensions = ["rel", "irrel"]
    cols = [[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]]
    for dom in domains:
        for dim in dimensions:
            plt.figure(figsize=(15, 5))
            for ii, param in enumerate(parameters):
                # average parameter estimates across tasks (orange/blue)
                p_blocked = np.asarray(
                    [
                        betas[dom]["blocked"][tasks[0]][dim][:, ii],
                        betas[dom]["blocked"][tasks[1]][dim][:, ii],
                    ]
                ).mean(0)
                p_interleaved = np.asarray(
                    [
                        betas[dom]["interleaved"][tasks[0]][dim][:, ii],
                        betas[dom]["interleaved"][tasks[1]][dim][:, ii],
                    ]
                ).mean(0)
                # bar plots with errorbars
                plt.subplot(1, 3, ii + 1)
                ax = plt.gca()

                ax.bar(
                    0, p_blocked.mean(), yerr=sem(p_blocked, 0), color=cols[0], zorder=1
                )
                ax.bar(
                    1,
                    p_interleaved.mean(),
                    yerr=sem(p_interleaved, 0),
                    color=cols[1],
                    zorder=1,
                )

                # ax.scatter(
                #     np.zeros((len(p_blocked), 1)) - 0.1, p_blocked, color="k", zorder=3
                # )
                # ax.scatter(
                #     np.ones((len(p_interleaved), 1)) - 0.1,
                #     p_interleaved,
                #     color="k",
                #     zorder=3,
                # )
                _, pval = stats.ttest_ind(p_blocked.squeeze(), p_interleaved.squeeze())
                ax.set(
                    xticks=[0, 1],
                    xticklabels=("blocked", "interleaved"),
                    ylabel=r"$\beta$ estimate (a.u)",
                    title=param + ", p=" + str(np.round(pval, 3)),
                )
                sns.despine()

            plt.suptitle(dom + " - " + dim + " dim", fontweight="bold")
            plt.tight_layout()


def disp_choicemat(cmat):
    plt.imshow(cmat)
    plt.clim(0, 1)
    plt.xlabel("speed")
    plt.ylabel("size")


def disp_choicemats(
    choicemats: dict,
    onlygood: bool = True,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
    whichtask: str = "base",
):
    """
    displays choice probability matrices for each task
    and domain
    """
    tasks = ["task_a", "task_b"]
    if onlygood is True:
        tasks = [t + "_good" for t in tasks]
    task_labels = ["orange store (speed)", "blue store (size)"]
    # parameters = ["lapse rate", "slope", "offset"]

    for dom in domains:

        plt.figure(figsize=(10, 10))
        plt.subplot(2, 2, 1)
        cmat = np.nanmean(choicemats[dom]["blocked"][tasks[0]], 0)
        disp_choicemat(cmat)

        plt.title(task_labels[0] + " - blocked")
        plt.subplot(2, 2, 2)
        cmat = np.nanmean(choicemats[dom]["blocked"][tasks[1]], 0)
        disp_choicemat(cmat)
        plt.title(task_labels[1] + " - blocked")

        plt.subplot(2, 2, 3)
        cmat = np.nanmean(choicemats[dom]["interleaved"][tasks[0]], 0)
        disp_choicemat(cmat)
        plt.title(task_labels[0] + " - interleaved")
        plt.subplot(2, 2, 4)
        cmat = np.nanmean(choicemats[dom]["interleaved"]["task_b_good"], 0)
        disp_choicemat(cmat)
        plt.title(task_labels[1] + " - interleaved")
        if not onlygood:
            plt.suptitle(
                dom.capitalize() + " - all subjects, " + whichtask + " task",
                fontweight="bold",
            )
        else:
            plt.suptitle(
                dom.capitalize() + " - only good, " + whichtask + " task",
                fontweight="bold",
            )
        plt.tight_layout()


def disp_rsa_param_estimates(
    betas: dict,
    onlygood: bool = False,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    """
    displays average parameter estimates of model-based rsa on choices

    """

    tasks = ["task_a", "task_b"]
    if onlygood is True:
        tasks = [t + "_good" for t in tasks]
    parameters = ["factorised model", "linear model"]
    cols = [[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]]

    for dom in domains:
        plt.figure(figsize=(15, 5))
        for ii, param in enumerate(parameters):
            # average parameter estimates across tasks (orange/blue)
            p_blocked = betas[dom]["blocked"][:, ii]
            p_interleaved = betas[dom]["interleaved"][:, ii]

            # bar plots with errorbars
            plt.subplot(1, 2, ii + 1)
            ax = plt.gca()
            ax.bar(0, p_blocked.mean(), yerr=sem(p_blocked, 0), color=cols[0], zorder=1)
            ax.bar(
                1,
                p_interleaved.mean(),
                yerr=sem(p_interleaved, 0),
                color=cols[1],
                zorder=1,
            )

            # ax.scatter(
            #     np.zeros((len(p_blocked), 1)) - 0.1, p_blocked, color="k", zorder=3
            # )
            # ax.scatter(
            #     np.ones((len(p_interleaved), 1)) - 0.1,
            #     p_interleaved,
            #     color="k",
            #     zorder=3,
            # )
            _, pval = stats.ttest_ind(p_blocked, p_interleaved)
            ax.set(
                xticks=[0, 1],
                xticklabels=("blocked", "interleaved"),
                ylabel=r"$\beta$ estimate (a.u)",
                title=param + ", p=" + str(np.round(pval, 3)),
            )
            sns.despine()

        plt.suptitle(dom, fontweight="bold")
        plt.tight_layout()


def disp_model_estimates(
    thetas: dict,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
):
    """
    displays average parameter estimates of choice model
    """

    parameters = ["bias", "lapse", "slope", "offset"]

    cols = [[0.2, 0.2, 0.2], [0.6, 0.6, 0.6]]
    for dom in domains:
        plt.figure(figsize=(15, 5))
        # average bias across tasks
        for cur in curricula:
            thetas[dom][cur]["bias"] = np.stack(
                (thetas[dom][cur]["bias_a"], thetas[dom][cur]["bias_b"]), axis=1
            ).mean(1)
        for ii, param in enumerate(parameters):
            # average parameter estimates across tasks (orange/blue)
            p_blocked = thetas[dom]["blocked"][param]
            p_interleaved = thetas[dom]["interleaved"][param]
            # bar plots with errorbars
            plt.subplot(1, 4, ii + 1)
            ax = plt.gca()
            ax.bar(0, p_blocked.mean(), yerr=sem(p_blocked, 0), color=cols[0], zorder=1)
            ax.bar(
                1,
                p_interleaved.mean(),
                yerr=sem(p_interleaved, 0),
                color=cols[1],
                zorder=1,
            )

            # ax.scatter(
            #     np.zeros((len(p_blocked), 1)) - 0.1, p_blocked, color="k", zorder=3
            # )
            # ax.scatter(
            #     np.ones((len(p_interleaved), 1)) - 0.1,
            #     p_interleaved,
            #     color="k",
            #     zorder=3,
            # )
            _, pval = stats.ttest_ind(p_blocked, p_interleaved)
            ax.set(
                xticks=[0, 1],
                xticklabels=("blocked", "interleaved"),
                ylabel="parameter estimate (a.u)",
                title=param + ", p=" + str(np.round(pval, 4)),
            )
            sns.despine()

        plt.suptitle(dom, fontweight="bold")
        plt.tight_layout()
