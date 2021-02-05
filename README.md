CesiumWidget3
===============================

An attempt to recreate the [CesiumWidget](https://github.com/petrushy/CesiumWidget) in 2021 to work with jupyterlab and updated ecosysttems.

This widget is based on the [CesiumJS](https://cesium.com/cesiumjs/) geospatial visualization.


Installation
------------

To install use pip:

    $ pip install cesiumwidget3

For a development installation (requires [Node.js](https://nodejs.org) and [Yarn version 1](https://classic.yarnpkg.com/)),

    $ git clone https://github.com//CesiumWidget3.git
    $ cd CesiumWidget3
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --overwrite --sys-prefix cesiumwidget3
    $ jupyter nbextension enable --py --sys-prefix cesiumwidget3

When actively developing your extension for JupyterLab, run the command:

    $ jupyter labextension develop --overwrite cesiumwidget3

Then you need to rebuild the JS when you make a code change:

    $ cd js
    $ yarn run build

You then need to refresh the JupyterLab page when your javascript changes.
