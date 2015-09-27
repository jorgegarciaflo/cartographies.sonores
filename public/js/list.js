var LanguageList = (function (Stores, Actions, Dispatcher) {
    var module = {}
    var Link = ReactRouter.Link;

    var TableRow = React.createClass({
        getDefaultProps: function () {
            return { header: false };
        },

        render: function () {
            var props = this.props;

            var items = this.props.items.map(function(v, col) {
                if (props.header)
                    return <th>{v}</th>;
                else
                    return <td><Link to="langue" params={{langue_id: props.item_id}}>{v}</Link></td>
                    //return <td onClick={function () { props.callback(props.item_id) }}>{v}</td>
            }).toArray();

            var style = { display: props.display ? 'table-row' : 'none' };
            return <tr style={style}>{items}</tr>;
        }
    });

    var SearchCell = React.createClass({
        render: function () {
            return <td><input onChange={this._onChange}/></td>;
        },

        _onChange: function (e) {
            this.props.callback(e.target.value);
        }
    });

    var Table = React.createClass({
        getInitialState: function() {
            return { display: Stores.language.getDisplay() };
        },

        componentDidMount: function () {
            Stores.language.on('update_display', this._updateDisplay);
        },

        componentWillUnmount: function() {
            Stores.language.off('update_display', this._updateDisplay);
        },

        render: function() {
            var props = this.props;
            var state = this.state;

            var rows = props.data.map(function(r, i) {
                var items = props.columns.map(function(c) {
                    return r.get(c);
                });
       
                return <TableRow 
                            items={items} 
                            callback={props.callback}
                            display={state.display.get(i)}
                            item_id={r.get('id')} />
            }).toArray();

            var _filter = this._filter;
            var search_row = props.columns.map(function(c) {
                var cb = function (value) { _filter(c, value) };
                return <SearchCell callback={cb} />;
            }).toArray();

            return (
                    <table className="table">
                        <TableRow header={true} items={props.column_names} display={true}/>
                        <tr>{search_row}</tr>
                        {rows}
                    </table>
                   );
        },

        _filter: function(column, value) {
            Actions.language.updateFilter(column, value);
        },

        _updateDisplay: function () {
            this.setState({ display: Stores.language.getDisplay() });
        }
    });

    module.view = React.createClass({
        getInitialState: function() {
            return { data: Stores.language.getAll() };
        },

        render: function() {
            var callback = function(id) {
                Actions.app.showDetails(id);
            };
            return (
                    <Table
                        data={this.state.data}
                        callback={callback}
                        columns={Immutable.List(['name', 'glottonym', 'country', 'family', "speakers"])}
                        column_names={Immutable.List(['Langue', 'Glottonyme', 'Pays', 'Famille', "Locuteurs"])}
                    />
                   );
        }
    });

    return module;
}(Stores, Actions, Dispatcher));
