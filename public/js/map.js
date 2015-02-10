
var LeafletMap = React.createClass({
    componentDidMount: function () {
        var map = L.map(this.getDOMNode()).setView([51.505, -0.09], 2);

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    minZoom: 2, 
                    maxZoom: 8, 
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                }).addTo(map);


        this._markers = LanguageStore.getAll().map(function (row) {
            var marker = L.marker([row.get('lat'), row.get('lon')]).addTo(map);
            marker.bindPopup(row.get('language'));

            return marker;
        }.bind(this));
    },

    render: function () {
        return <div className="leaflet-map" />
    },
});
