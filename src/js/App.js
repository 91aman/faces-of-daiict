import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import $ from 'jquery';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ShareIcon from 'material-ui/lib/svg-icons/social/share';
import SadIcon from 'material-ui/lib/svg-icons/social/mood-bad';
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

class ImageComp extends Component {
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
                        onload={() => {console.log('loaded')}}
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
                                    mobile_iframe : 'true',
                                    hashtag:'#facesOfDaiict',
                                    href: `http://faces-of-daiict.in/?query=${klass}${batch}${pad(iter,3)}`
                                }, function(response){});
                            }}
                            style={{
                            float: 'right',
                            fill: 'white'
                        }}/>
                    </div>
                </div>
        )
    }
}

function check() {
    const sprite = new Image();

    sprite.onload = () => {
        this.setState({ecampus: 'ok'});
    };

    sprite.onerror = () => {
        this.setState({ecampus: 'error'});
    };

    sprite.src = 'https://ecampus.daiict.ac.in/webapp/intranet/StudentPhotos/201001231.jpg';
}

const ErrorComponent = () => {
    return (
        <div className="error-cont">
            <SadIcon
                style={{
            height:'100px',
            width :'100px',
            fill :'#3F51B5'
           }}
            />
            <div>
                <p>The source of the images is <a href="https://ecampus.daiict.ac.in/webapp/intranet/index.jsp"
                                                  target="_blank">ecampus.daiict.in</a></p>
                <p>Unfortunately due high volume of interaction on this site, the images on the ecampus site have now suddenly
                    stop loading. Either there is some issue with ecampus or they have removed these images.
                </p>

                <p>Inconvenience caused is highly regretted.</p>
            </div>
        </div>
    )
};


class App extends Component {

    constructor(props) {
        super(props);
        const query = window.location.search.slice(1).split('=')[1] || '';

        check.call(this);
        this.state = {
            klass: query.substring(0, 4) || '2010',
            batch: query.substring(4, 6) || '01',
            id: query.substring(6, 9),
            ecampus: 'checking'
        };
    }

    componentWillUpdate(nextProps, nextState) {
        const {batch,klass } = this.state;
        if (nextState.batch !== batch || nextState.klass !== klass) {
            window.stop();
            this.refs['result-wrap'].scrollTop = 0;
        }
    }

    render() {
        const {batch = '01', klass = '2010', id, ecampus}= this.state;

        let resultEl = (
            <Halogen.BounceLoader className="loader" color={'#C5CAE9'}/>
        );

        if (ecampus === 'error') {
            resultEl = <ErrorComponent/>;
        } else if (ecampus === 'ok') {
            resultEl = (<div>
                {
                    id && <div className="query-result">
                        <ImageComp
                            key={`1${klass}${batch}${id}`}
                            klass={klass}
                            batch={batch}
                            selected
                            iter={+id}
                        /></div>
                }
                <div className="batch-cont">{_.times((ClassSize[klass] || MAX_SIZE)[batch] + 1, (iter) => {
                    return <ImageComp
                        key={`${klass}${batch}${iter}`}
                        klass={klass}
                        batch={batch}
                        iter={iter}
                    />
                })}</div>
            </div>)
        }


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
                <section ref="result-wrap" className={classnames("result-wrap", {'withResult' : id})}>
                    {resultEl}
                </section>
                <section className="footer">
                    <iframe
                        src="https://www.facebook.com/plugins/share_button.php?href=http%3A%2F%2Ffaces-of-daiict.in&layout=button_count&size=small&mobile_iframe=true&appId=1640961189549252&width=69&height=20"
                        width="69" height="20" style={{border:'none',overflow:'hidden'}} scrolling="no" frameborder="0"
                        allowTransparency="true"></iframe>
                    <a
                        className="twitter-share-button"
                        href="https://twitter.com/intent/tweet?text=#facesOfDaiict - http://faces-of-daiict.in">
                        Tweet
                    </a>
                </section>
            </div>

        );
    }
}

export default App;