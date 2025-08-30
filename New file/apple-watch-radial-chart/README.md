# Apple Watch Radial Chart

A Pen created on CodePen.

Original URL: [https://codepen.io/markni/pen/qBJWNd](https://codepen.io/markni/pen/qBJWNd).

Tried recreate apple watch's radial chart with d3. Turns out to be surprisingly hard. D3 natively does not support round corner on arcs, not to mention that conical gradient involves lots of hacks as well. 

Used a modified version of d3 by mbostock, which implemented a round corner for arcs in d3, see more details on this pull request on github (which have never made into production):

https://github.com/mbostock/d3/pull/1132