
import React from 'react';
import { Link } from 'react-router';
import {Loading} from './Loading';
import Modal from 'react-modal';

import input from '../../sass/input.scss';
import button from '../../sass/button.scss';

import link from '../constants/link';
import response from '../constants/response'

const modalStyles ={
    overlay : {
        position          : 'fixed',
        top               : 0,
        left              : 0,
        right             : 0,
        bottom            : 0,
        backgroundColor   : 'rgba(255, 255, 255, 0.75)'
    },
    content : {
        position                   : 'absolute',
        border                     : '1px solid #ccc',
        borderRadius                : '0px',
        background                 : '#fff',
        overflow                   : 'auto',
        WebkitOverflowScrolling    : 'touch',
        outline                    : 'none',
        padding                    : '20px',
        transition                 : 'all 0.5s ease-in-out',
        width                      : '400px',
        height                     : '200px',
        left                        : '50%',
        top                         : '50%',
        transform                   : 'translate(-50%, -50%)',
        textAlign                   :'center'
    }
}

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
        this.selectLocation = this.selectLocation.bind(this);
        this.searchFloorStructure = this.searchFloorStructure.bind(this)
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);


        this.state = {
            locations : [],
            pickLocation: [],
            error: false,
            pickingMode: false,
            start: true,
            exactLocation:false,
            foundFloors: [],
            resultMode: false,
            modalIsOpen: false,
            selectedFloor: null
        };
    }
    search(){
        this.setState({
            start: false,
            resultMode: false
        })
        let searchText = document.getElementById('searchText').value;
        // xhttp request for google geocoding
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //parse json
                let googleResponse = JSON.parse(xhttp.responseText);

                if(googleResponse.status ==="OK"){
                    this.setState({
                        locations : googleResponse.results.map((element)=>{
                            return {
                                exact: element["formatted_address"],
                                geo: element["geometry"].location,
                                types: element["types"]
                            }
                        })
                    });
                    this.setState({
                        pickLocation: this.state.locations.filter(function(location){
                            let selected = false;
                           response.google.EXACT.forEach(function (element) {
                               if(location.types.indexOf(element)> -1){
                                   selected = true;
                               }
                           });
                           return selected;
                        })
                    });
                    this.setState({
                        exactLocation: this.state.pickLocation.length===1
                    })
                    //if one exact location is found.
                    if(this.state.pickLocation.length ===1){
                        this.setState({
                            pickingMode: false
                        });
                    }else {
                        this.setState({
                            pickingMode: true
                        })
                    }
                    if(this.state.exactLocation){
                        this.searchFloorStructure();
                    }
                }else {
                    this.setState({
                        locations: [],
                        pickLocation: []
                    });
                }
            }else {
                this.setState({
                    locations: [],
                    pickLocation: [],
                    error: true
                });
            }
        }.bind(this);

        xhttp.open("GET", link.google+"="+searchText+ "&key="+link.key, true);
        xhttp.send();

        //
    }
    selectLocation(element){
        let location = arguments[0];
        this.state.pickLocation = [location];

        this.setState({
            pickingMode: false
        });
        this.searchFloorStructure();
    }
    searchFloorStructure(){
        let xhttp = new XMLHttpRequest();
        let foundFloors=[];
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                let cubiResponse = JSON.parse(xhttp.responseText);
                this.setState({
                    foundFloors : cubiResponse.features,
                    resultMode: true
                });

            }else {
                this.setState({
                    error : true
                });
            }
        }.bind(this)
        // check exact address
        if(this.state.exactLocation){
            console.log('exact location');
            xhttp.open("GET", link.cubicasa+"="+this.state.pickLocation[0].geo.lng+","+ this.state.pickLocation[0].geo.lat+",5", true);
        }else {
            xhttp.open("GET", link.cubicasa+"="+this.state.pickLocation[0].geo.lng+","+ this.state.pickLocation[0].geo.lat+","+response.cubicasa.RADIUS, true);
        }

        xhttp.send();

    }
    renderFloorplan(){
        if(this.state.foundFloors.length === 0){
            return (
                <div>
                    Some locations have not updated yet.
                </div>

            )
        }else {
            return this.state.foundFloors.map((element)=>{
                console.log(element)
                let isHave3D = (element.properties.models[0].obj !== null);
                return (
                    <div className="floor-container">
                        <h4>{element.properties.streetaddress}</h4>
                        <div className="floor-action">
                            <button onClick={this.openModal.bind(null, element)}>Download 2D</button>
                            {
                                isHave3D ?  <a href={link.viewer+ element.properties.id}>
                                    <button>
                                        View 3D
                                    </button>
                                </a> :<a href="">
                                    <button>Request 3D</button>
                                </a>
                            }
                        </div>
                    </div>
                );
            });
        }
    }
    renderPickingMode(){
        return this.state.locations.map((element)=>{
            return (
                <div className="location-picking" onClick={this.selectLocation.bind(null,element)}>
                    <div className="icon">
                        <img src="icons/location.svg"/>
                    </div>
                    <div className="location-detail">
                        {element.exact}
                    </div>
                </div>
            );
        });
    }
    openModal(element){
        console.log(element);
        this.setState({
            selectedFloor: element,
            modalIsOpen: true
        });
    }
    closeModal(){
        this.setState({
            modalIsOpen: false
        })   
    }
    render(){
        return (
            <div>
                <div className="input-container">
                    <input type="text" id="searchText"/>
                    <button onClick={this.search}>Search</button>
                </div>
                <div className="search-status">
                    { !this.state.start ?
                        <div>
                            { this.state.locations.length === 0 ? <i>Your search did not match any location</i>: '' }
                            { this.state.pickLocation.length ===0 ? <i> Not specific location founded</i>: '' }
                        </div>
                        : ''
                    }
                </div>
                <div className="picking-locations">
                { this.state.pickingMode ? this.renderPickingMode(): '' }
                </div>
                <div className="result-container">
                    { this.state.resultMode ? this.renderFloorplan():''}
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={modalStyles} >
                    <h3>Are you the legal owner of this property?</h3>
                    <div>
                        { this.state.selectedFloor !== null ? <a href={this.state.selectedFloor.properties.models[0].svg} download={this.state.selectedFloor.properties.models[0].svg}>
                            <button>
                                Download
                            </button>
                            </a> : ''
                        }
                        <button onClick={ this.closeModal.bind(null)}>
                            Cancel
                        </button>
                    </div>
                </Modal>
            </div>
        )
    }
}


