
/*
 * We do not use a Flux architecture for this prototype, so things
 * are a bit ugly...
 */
var Stores = (function (Dispatcher) {
    var module = {};

    module.language = (function() {
        var Store = function (dispatcher) {
            this.load([]);
            this.token = dispatcher.register(this.handlePayload.bind(this));
        };
        Store.prototype = new EventEmitter();

        Store.prototype.load = function (data) {
            this._data = Immutable.fromJS(data);
            this._displayed = this._data.map(function() { return true; });

            this._filters = Immutable.Map({});

            if (this._data.count() == 0)
                this._columns = Immutable.List();
            else
                this._columns = this._data.get(0).keySeq();

            this._columns.forEach(function (c) {
                this._filters = this._filters.set(c, "");
            }.bind(this));

            this.trigger('update');
        };

        Store.prototype.getDisplay = function () {
            return this._displayed;
        };

        Store.prototype.getAll = function() {
                return this._data;
        };

        Store.prototype.updateFilter = function(column, value) {
            this._filters = this._filters.set(column, value.toLowerCase());

            var _filters = this._filters;
            var columns = this._columns;

            this._displayed = this._data.map(function(row) {
                return _filters.keySeq().every(function(column) {
                    var value = String(row.get(column)).toLowerCase();
                    var filter = _filters.get(column);
                    return value.indexOf(filter) >= 0;
                });
            });

            this.trigger('update_display');
        };

        Store.prototype.handlePayload = function (payload, dispatcher) {
            switch(payload.action.actionType) {
                case 'UPDATE_FILTER':
                    this.updateFilter(payload.action.column, payload.action.value);
                    break;
            }
        };

        return new Store(Dispatcher);
    } ());

    module.details = (function() {
        var Store = function(dispatcher) {
            this.language_id= null;
            this.data = null;
            this.cache = Immutable.Map();
            this.token = dispatcher.register(this.handlePayload.bind(this));
        };
        Store.prototype = new EventEmitter();

        Store.prototype.get = function (id) {
            var str_id = String(id);

            if (this.cache.has(str_id))
            {
                return this.cache.get(str_id);
            } 
            else
            {
                $.get('data/' + str_id, function(data) {
                    this.cache = this.cache.set(str_id, Immutable.fromJS(data));
                    this.trigger('update');
                }.bind(this));

                return null;
             } 
        }

        Store.prototype.handlePayload = function (payload, dispatcher) {
        };

        return new Store(Dispatcher);
    })();

    return module;
})(Dispatcher);
