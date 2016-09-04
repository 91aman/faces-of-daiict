import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ShareIcon from 'material-ui/lib/svg-icons/social/share';
import Halogen from 'halogen';
import classnames from 'classnames';
import ClassSize from './ClassSize';

const TOTAL_CLASS = 16,
    START_CLASS = 2001,
    MAX_SIZE = {
        '01': 375,
        '11': 75,
        '12': 130
    };

function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

function onSearchChange(key, value) {
    this.setState({[key]: value, id: undefined});
}

class Image extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false
        }
    }

    render() {
        const {klass, batch, iter, selected} = this.props;
        return (
            this.state.error ? <span/> :
                <div ref="container" className={classnames("prof-img-wrap", { 'selected' : selected})}>
                    <img
                        onload = {() => {console.log('loaded')}}
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
                                    href: `https://91aman.github.io/faces-of-daiict/?query=${klass}${batch}${pad(iter,3)}`
                                }, function(response){});
                            }}
                            style={{
                            float: 'right',
                            height: selected? '18px' :'9px',
                            width: selected ? '18px' :'9px',
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
        const query = window.location.search.slice(1).split('=')[1] || '';

        //searchParams.forEach((search) => {
        //    const searchSplit = search.split('=');
        //
        //    initialState[searchSplit[0]] = searchSplit[1] || initialState[searchSplit[0]];
        //});

        this.state = {
            klass: query.substring(0, 4) || '2010',
            batch: query.substring(4, 6) || '01',
            id: query.substring(6, 9)
        };
    }

    componentWillUpdate(nextProps, nextState) {
        const {batch,klass } = this.state;
        if (nextState.batch !== batch || nextState.klass !== klass) {
            window.stop();
        }
    }

    render() {
        const {batch = '01', klass = '2010', id}= this.state;

        return (
            <div className="app-cont">
                <section className="header">Faces of Daiict</section>
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
                    {
                        id && <div className="query-result">
                            <Image
                            key={`1${klass}${batch}${id}`}
                            klass={klass}
                            batch={batch}
                            selected
                            iter={+id}
                        /></div>
                    }
                    <div className="batch-cont">{_.times((ClassSize[klass] || MAX_SIZE)[batch] + 1, (iter) => {
                        return <Image
                            key={`${klass}${batch}${iter}`}
                            klass={klass}
                            batch={batch}
                            iter={iter}
                        />
                    })}</div>
                </section>
            </div>

        );
    }
}

export default App;