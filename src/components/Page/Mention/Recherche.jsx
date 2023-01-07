import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios';

export default function Recherche(props) {


    const [infoMention, setinfoMention] = useState({ id_mention: '', nom_mention: '', libmention: '', parcours: '', libparcours: ''});
    const [verfChamp, setverfChamp] = useState(false);

    const onInfoMention = (e) => {
        setinfoMention({ ...infoMention, [e.target.name]: e.target.value })
    }

    /* Modal */
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic2': setDisplayBasic2,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }
    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
        // onVideInfo()
        setverfChamp(false);

    }

    const renderFooter = (name) => {
        return (
            <div>
                <Button label="Fermer" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
            </div>
        );
    }
    const renderHeader = (name) => {
        return (
            <div>
                <h4 className='mb-1'>Recherche Client </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */




    //Recherche List client
    const RechercheloadData = async () => {
        props.setCharge(true);
        props.setlistClient([{ stat: 'Chargement de données...' }])
        axios.post(props.url + 'rechercheClientFact', infoMention)
            .then(
                (result) => {
                    props.setrefreshData(0);
                    props.setlistMention(result.data)
                    props.setCharge(false);
                    onHide('displayBasic2');
                }
            );
    }
    return (
        <div>

            <Button tooltip='Recherche' label='' icon={PrimeIcons.SEARCH} value="chercher" className=' p-button-secondary' onClick={() => onClick('displayBasic2')} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} className="lg:col-4 md:col-5 col-12 p-0" visible={displayBasic2} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-12 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Nom mention</label>
                                    <InputText id="username2" value={infoMention.nom_mention} aria-describedby="username2-help" name='code_client' className={"form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                </div>
                            </div>
                        </form>
                        {verfChamp ? <center><small id="username2-help" className="p-error block justify-content-center" style={{ fontWeight: 'bold' }}>Veuillez entrer la critère pour la recherche - Code ou Nom </small></center> : null}
                        <div className='flex mt-3 mr-4 justify-content-center '>
                            <Button icon={PrimeIcons.SEARCH} className='p-button-sm p-button-secondary ' label={'Reherche'} onClick={() => {

                                if (props.infoClient.code_client == "" && props.infoClient.nom == "") {
                                    setverfChamp(true)
                                }
                                else {
                                    setverfChamp(false)
                                    RechercheloadData()
                                }
                            }} />

                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
