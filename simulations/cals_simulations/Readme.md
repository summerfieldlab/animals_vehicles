## Repository for Positive Task Transfer project   
Project by Cal, Timo, Paul and Chris
### Synopsis
In previous work, we demonstrated that biological and artificial neural networks learn to represent classification rules as orthogonal one-dimensional manifolds. 
The orthogonality prevents mutual interference and promotes continual learning without overwriting past information. 
However, the inputs were highly structured and the rules themselves were mapped onto orthogonal dimensions in this feature space. Hence, it's unclear whether 
the same effects would be observed for non-orthogonal input dimensions (or even abstract features that are not grounded in input space).
Moreover, it's not feasible to project every new experience onto a manifold that is orthogonal to all extant manifolds. Firstly, very high-dimensional codes would be
required to accomodate a large number of orthogonal manifolds. Secondly, representations should be reusable whenever the same rule is applied to different contexts.
A simple solution would be to represent information along parallel instead of orthogonal manifolds, whenver the same readout can be used across tasks. 
Hence, the two aims of this project are 
1) Test if orthogonal manifolds are observed even where structure in the inputs is absent
2) develop a paradigm where both orthogonal and parallel planes would be expected.



