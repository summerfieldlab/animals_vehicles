# Codebase for category learning experiments with abstract features
This repository contains code for an experimental series on category learning with abstract features.

## Experiments
### Experiment 0: Norming of stimulus spaces
This is a rating task in which we asked participants to rate the size and speed of images depicting animals and vehicles. This served as norming exercise, to verify that the labels we had applied to these images are consistent with those given by participants.

### Experiment 1: Blocked versus interleaved training with abstract categories.
This is a version of the Flesch et al, 2018 experiment with the stimuli from experiment 1. We asked four groups of particpants to learn which type of animals (/vehicles) would sell well in two different shops. Training was either blocked or interleaved. Unbeknownst to the particpants, animals/vehicles varied systematically along the dimensions speed and size, in five discrete steps each. This spanned a 5x5 space of feature values. In each of the two shops, only a single dimension was task-relevant. We hypothesised that participants would find it easier to learn these category boundaries under blocked compared to interleaved training.

### Experiment 2: Blocked versus interleaved training for domain transfer.
This experiment is almost identical to Experiment 1. This time, however, participants were trained on animals (/vehicles), which we call the base task, and then evaluated both on the base task and a transfer task, where stimuli from the other domain were shown. Participants were told that customers going to the base task and transfer task shops would have similar preferences. We hypothesised that those who were trained on a blocked curriculum and hence had a better estimate of the underlying feature dimensions (speed/size) would be better at the transfer task (testing speed/size on the other domain) compared to those trained on interleaved data. After the main experiment, participants of all groups completed a rating task in which they arranged stimuli in a circular arena (drag & drop) according to the rule they applied for each task (for example, order them by size in the size shop etc).
