import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ShareIcon from 'material-ui/lib/svg-icons/social/share';
import Halogen from 'halogen';
import classnames from 'classnames';

const TOTAL_CLASS = 16,
    START_CLASS = 2001,
    MAX_SIZE = {
        '01': 275,
        '11': 75,
        '12': 130
    };

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function onSearchChange(key, value) {
    this.setState({[key]: value});
}

class Image extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false
        }
    }

    render() {
        const {klass, batch, iter} = this.props;
        return (
            this.state.error ? <span/> :
                <div className="prof-img-wrap">
                    <img
                        onError={() => {this.setState({error : true})}}
                        className={classnames( "prof-img", {'hide' : this.state.error})}
                        src={`https://ecampus.daiict.ac.in/webapp/intranet/StudentPhotos/${klass}${batch}${pad(iter,3)}.jpg`}
                    />
                    <div className="prof-img-value">
                        {iter}
                        <ShareIcon
                            className="share-icon"
                            onClick={() => {
                                console.log('clicked', klass, batch, iter);
                                FB.ui({
                                    method: 'share',
                                    display: 'popup',
                                    hashtag:'#facesOfDaiict',
                                    quote : `https://91aman.github.io/faces-of-daiict/?klass=${klass}&batch=${batch}&id=${pad(iter,3)}`,
                                    post : `https://91aman.github.io/faces-of-daiict/?klass=${klass}&batch=${batch}&id=${pad(iter,3)}`,
                                    text : `https://91aman.github.io/faces-of-daiict/?klass=${klass}&batch=${batch}&id=${pad(iter,3)}`,
                                    message : `https://91aman.github.io/faces-of-daiict/?klass=${klass}&batch=${batch}&id=${pad(iter,3)}`,
                                    href: `https://91aman.github.io/faces-of-daiict/?klass=${klass}&batch=${batch}&id=${pad(iter,3)}`
                                }, function(response){});
                            }}
                            style={{
                            float: 'right',
                            height: '9px',
                            width: '9px',
                            fill: 'white'
                        }}/>
                    </div>
                </div>
        )
    }
}

class App extends Component {

    constructor(props) {
        super(props);

        const initialState = {
            batch: '11',
            klass: '2010',
            loading: true
        };

        const searchParams = window.location.search.slice(1).split('&');

        searchParams.forEach((search) => {
            const searchSplit = search.split('=');

            initialState[searchSplit[0]] = searchSplit[1] || initialState[searchSplit[0]];
        });

        this.state = initialState;
    }

    componentWillUpdate(nextProps, nextState) {
        const {batch,klass } = this.state;
        if (nextState.batch !== batch || nextState.klass !== klass) {
            window.stop();
        }
    }

    render() {
        const {batch = '01', klass = '2010', loading}= this.state;

        return (
            <div className="app-cont">
                <section className="search-wrap">
                    <SelectField
                        value={+klass}
                        onChange={(e, index,value) => {onSearchChange.call(this,'klass', value)}}
                        //floatingLabelText="Class"
                        style={{
                        textAlign : 'left',
                        width:'100px',
                        marginRight : '30px'
                        }}
                    >
                        {_.times(TOTAL_CLASS, (iter) => {
                            const klass = START_CLASS + iter;

                            return <MenuItem key={klass} value={klass} primaryText={klass}/>
                        })}
                    </SelectField>
                    <SelectField
                        value={batch}
                        onChange={(e, index,value) => {onSearchChange.call(this, 'batch', value)}}
                        //floatingLabelText="Batch"
                        style={{
                        textAlign : 'left',
                        width:'100px'
                        }}
                    >
                        <MenuItem key={'01'} value={'01'} primaryText="B.Tech"/>
                        <MenuItem key={'11'} value={'11'} primaryText="M.Tech"/>
                        <MenuItem key={'12'} value={'12'} primaryText="Mscit"/>
                    </SelectField>
                </section>
                <section className="result-wrap">
                    {_.times(MAX_SIZE[batch], (iter) => {
                        return <Image key={`${klass}${batch}${iter}`} klass={klass} batch={batch} iter={iter}/>
                    })}
                </section>
            </div>

        );
    }
}

export default App;