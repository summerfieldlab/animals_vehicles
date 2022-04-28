import os
import yaml
import numpy as np
from typing import Dict


def init_alldata(keys: list) -> Dict:
    """initialised data dictionary

    Args:
        keys (list): list with variables for data dict

    Returns:
        Dict: empty initialised nested data dictionary
    """
    alldata = {
        "animals": {"blocked": {}, "interleaved": {}},
        "vehicles": {"blocked": {}, "interleaved": {}},
    }
    for dom in alldata.keys():
        for cur in alldata[dom].keys():
            # add expt fields
            for k in keys:
                alldata[dom][cur][k] = []
    return alldata


def parse_alldata(
    data_dir: str,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
    transfertask: bool = False,
    arenatask: bool = False,
) -> Dict:
    """parses data from .json files (one file per subject) and returns nested dictionary
       with data organised by curriculum and training domain

    Args:
        data_dir (str): path to raw data
        domains (list, optional): training domains to parse. Defaults to ["animals", "vehicles"].
        curricula (list, optional): training curricula to parse. Defaults to ["blocked", "interleaved"].
        transfertask(bool, optional): parse data from transfer task (which has slightly different expt keys)
        arenatask (bool, optional): whether or not to parse data from arena task (rating expt)

    Returns:
        Dict: nested dictionary with data of all participants, organised by training domain and curriculum
    """
    if transfertask:
        keys_expt_in = [
            "expt_domainIDX",
            "expt_sessIDX",
            "expt_contextIDX",
            "expt_catIDX",
            "expt_sizeIDX",
            "expt_speedIDX",
            "expt_exemplarIDX",
        ]
        keys_expt_out = [
            "expt_domain",
            "expt_session",
            "expt_context",
            "expt_category",
            "expt_size",
            "expt_speed",
            "expt_exemplar",
        ]
        keys_rules_in = ["rule_taskOrange", "rule_taskBlue"]
        keys_rules_out = ["resp_ruleSize", "resp_ruleSpeed"]

    else:
        keys_expt_in = [
            "expt_domainIDX",
            "expt_sessIDX",
            "expt_block",
            "expt_contextIDX",
            "expt_catIDX",
            "expt_branchIDX",
            "expt_leafIDX",
            "expt_exemplarIDX",
        ]
        keys_expt_out = [
            "expt_domain",
            "expt_session",
            "expt_block",
            "expt_context",
            "expt_category",
            "expt_size",
            "expt_speed",
            "expt_exemplar",
        ]

        keys_rules_in = ["rule_taskNorth", "rule_taskSouth"]
        keys_rules_out = ["resp_ruleSpeed", "resp_ruleSize"]

    keys_resp_inout = [
        "resp_reactiontime",
        "resp_category",
        "resp_correct",
        "resp_reward",
    ]

    keys_arena_in = [
        "arena_trialID",
        "arena_stimSizeLevel",
        "arena_stimSpeedLevel",
        "arena_stimDomain",
        "arena_stimCoords_Final",
        "arena_stimNames",
    ]

    keys_arena_out = [
        "arena_trial",
        "arena_size",
        "arena_speed",
        "arena_domain",
        "arena_coords",
        "arena_filenames",
    ]

    # in edata
    keys_edata_out = [
        "expt_duration",
        "expt_taskorder",
        "participant_age",
        "participant_sex",
    ]

    # initialise datastruct:
    if arenatask:
        alldata = init_alldata(
            keys_expt_out
            + keys_rules_out
            + keys_resp_inout
            + keys_edata_out
            + keys_arena_out
        )
    else:
        alldata = init_alldata(
            keys_expt_out + keys_rules_out + keys_resp_inout + keys_edata_out
        )
    # loop over subject data and add to alldata struct
    files = os.listdir(data_dir)
    for ii, fn in enumerate(files):
        if round(ii / len(files) * 100) % 10 == 0:
            print(f"parsed {ii}/{len(files)} files")
        with open(data_dir + fn, "r") as f:
            data = yaml.load(f, Loader=yaml.FullLoader)
        # rename domain variable (1==animals, 2==vehicles)
        data["sdata"]["expt_domainIDX"] = (
            np.asarray(data["sdata"]["expt_domainIDX"]) == "ve_"
        ).astype(int) + 1
        data["data_arenatask"]["arena_stimDomain"] = (
            np.asarray(data["data_arenatask"]["arena_stimDomain"]) == "ve_"
        ).astype(int) + 1
        # add participant and expt info
        dom = data["parameters"]["domains"][0]
        cur = data["task_id"][0]
        alldata[dom][cur]["expt_duration"].append(
            (data["edata"]["exp_finishtime"] - data["edata"]["exp_starttime"]) / 60000
        )
        alldata[dom][cur]["participant_age"].append(data["edata"]["expt_age"])
        alldata[dom][cur]["participant_sex"].append(data["edata"]["expt_sex"])
        alldata[dom][cur]["expt_taskorder"].append(data["task_id"][1:])

        # add expt_data to alldata
        for kIn, kOut in zip(keys_expt_in, keys_expt_out):
            datamat = np.asarray(data["sdata"][kIn], dtype=np.float)
            alldata[dom][cur][kOut].append(datamat)

        # add resp data
        for key in keys_resp_inout:
            datamat = np.asarray(data["sdata"][key], dtype=np.float)
            alldata[dom][cur][key].append(datamat)

        # add rule feedback
        for kIn, kOut in zip(keys_rules_in, keys_rules_out):
            alldata[dom][cur][kOut].append(data[kIn])

        # add arena task data
        for kIn, kOut in zip(keys_arena_in, keys_arena_out):
            alldata[dom][cur][kOut].append(data["data_arenatask"][kIn])
    # convert expt and resp fields to numpy arrays (subject-x-trials)
    npkeys = keys_resp_inout + keys_expt_out
    if arenatask:
        npkeys += keys_arena_out

    for dom in domains:
        for cur in curricula:
            for key in npkeys:
                alldata[dom][cur][key] = np.asarray(alldata[dom][cur][key])
    alldata = boundary_to_nan(alldata)
    return alldata


def boundary_to_nan(
    alldata: Dict,
    domains: list = ["animals", "vehicles"],
    curricula: list = ["blocked", "interleaved"],
) -> Dict:
    """helper function that sets all boundary trials in response vectors to NaN

    Args:
        alldata (Dict): experiment data parsed into nested dict
        domains (list, optional): training domains. Defaults to ["animals", "vehicles"].
        curricula (list, optional): training curricula. Defaults to ["blocked", "interleaved"].

    Returns:
        Dict: input dict, but with boundary trials set to NaN
    """
    for dom in domains:
        for cur in curricula:
            alldata[dom][cur]["resp_correct"][
                alldata[dom][cur]["expt_category"] == 0
            ] = np.nan
    return alldata
