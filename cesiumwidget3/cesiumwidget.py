import ipywidgets as widgets
from traitlets import List, Unicode, Bool, CaselessStrEnum, Float, List, Unicode, Tuple

# See js/lib/example.js for the frontend counterpart to this file.

@widgets.register
class CesiumWidget(widgets.DOMWidget):
    """An example widget."""

    # Name of the widget view class in front-end
    _view_name = Unicode('CesiumView').tag(sync=True)

    # Name of the widget model class in front-end
    _model_name = Unicode('CesiumModel').tag(sync=True)

    # Name of the front-end module containing widget view
    _view_module = Unicode('CesiumWidget3').tag(sync=True)

    # Name of the front-end module containing widget model
    _model_module = Unicode('CesiumWidget3').tag(sync=True)

    # Version of the front-end module containing widget view
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    # Version of the front-end module containing widget model
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    # Widget specific property.
    # Widget properties are defined as traitlets. Any property tagged with `sync=True`
    # is automatically synced to the frontend *any* time it changes in Python.
    # It is synced back to Python from the frontend *any* time the model is touched.
    value = Unicode('Hello World!').tag(sync=True)

    czml = Tuple().tag(sync=True)
    kml_url = Unicode().tag(sync=True)
    geojson = Unicode().tag(sync=True)

    _zoomto = List(trait=Float, allow_none=True).tag(sync=True)
    _flyto = List(trait=Float, allow_none=True).tag(sync=True)
    _zoomtoregion = List(trait=Float, allow_none=True).tag(sync=True)

    animation = Bool(True).tag(sync=True)
    base_layer_picker = Bool(True).tag(sync=True)
    geocoder = Bool(True).tag(sync=True)
    home_button = Bool(True).tag(sync=True)
    infobox = Bool(True).tag(sync=True)
    scene_mode_picker = Bool(True).tag(sync=True)
    selection_indicator = Bool(True).tag(sync=True)
    timeline = Bool(True).tag(sync=True)
    navigation_help_button = Bool(True).tag(sync=True)
    navigation_instructions_initially_visible = Bool(False).tag(sync=True)
    scene_3D_only = Bool(False).tag(sync=True)
    scene_mode = CaselessStrEnum(['COLUMBUS_VIEW', 'SCENE2D', 'SCENE3D'],
                                 default_value='SCENE3D',
                                 allow_none=False).tag(sync=True)
    enable_lighting = Bool(False).tag(sync=True)

    def zoom_to(self, lon, lat, alt, heading=0, pitch=-90, roll=0):
        self._zoomto = [lon, lat, alt, heading, pitch, roll]

    def fly_to(self, lon, lat, alt, heading=0, pitch=-90, roll=0):
        self._flyto = [lon, lat, alt, heading, pitch, roll]

    def zoom_to_region(self, west, south, east, north):
        self._zoomtoregion = [west, south, east, north]

