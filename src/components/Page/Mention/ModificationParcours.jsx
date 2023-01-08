import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function ModificationParcours(props) {

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }
    //Declaration useSatate
    const [verfChamp, setverfChamp] = useState({ parcours: false, libparcours: false, id_mention: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const [infoMention, setinfoMention] = useState({ parcours: '', libparcours: '', id_mention: '' });
    const [identique, setidentique] = useState(false)
    //DropDown
    const [listMention, setlistMention] = useState([{ label: '', value: '' }]);
    const [valueDropdown, setvalueDropdown] = useState(null);

    const onVideInfo = () => {
        setidentique(false)
        setvalueDropdown(null);
        setinfoMention({ parcours: '', libparcours: '', id_mention: '' });
    }

    const onInfoMention = (e) => {
        setinfoMention({ ...infoMention, [e.target.name]: e.target.value })
    }
    const onTypesChange = (e) => {
        setvalueDropdown(e.value);
        setinfoMention({ ...infoMention, [e.target.name]: (e.target.value) });
    }

    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    /**Style css */
    //Get List mention
    const loadData = async () => {
        await axios.get(props.url + `getIdMention`)
            .then(
                (result) => {
                    setlistMention(result.data);
                }
            );
    }


    const chargerData = (data) => {
        setinfoMention({ id_parcours:data.id_parcours,id_mention: data.id_mention, libparcours: data.abbrparcours, parcours: data.nom_parcours })
        setTimeout(() => {
            loadData();
        }, 500)
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
        setverfChamp({ code_client: false, nom: false });
        onVideInfo();
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
                <h4 className='mb-1'>Nouveau Parcours </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */



    //Ajout de donnees vers Laravel
    const onSub = async () => {
        if (infoMention.id_mention == props.data.id_mention && infoMention.libparcours == props.data.abbrparcours && infoMention.parcours == props.data.nom_parcours) {
            setidentique(true)
        } else {
            setidentique(false)
            setverfChamp({ parcours: false, libparcours: false, id_mention: false })
            setcharge({ chajoute: true });
            await axios.put(props.url + 'updateParcours', infoMention)
                .then(res => {
                    //message avy @back
                    notificationAction(res.data.etat, 'Enregistrement', res.data.message);
                    setcharge({ chajoute: false });
                    setTimeout(() => {
                        props.setrefreshData(1);
                        onHide('displayBasic2');
                    }, 300)
                })
                .catch(err => {
                    console.log(err);
                    //message avy @back
                    notificationAction('error', 'Erreur', err.data.message);
                    setcharge({ chajoute: false });
                });
        }
    }
    return (
        <>
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-1 mr-2 ' style={stylebtnRec} tooltip='Modifier' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargerData(props.data) }} />
            <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <div className="p-1 style-modal-tamby" >
                    <form className='flex flex-column justify-content-center'>
                        <div className='grid px-4'>
                            <div className="col-12 field my-1 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Nom Mention</label>
                                <Dropdown value={valueDropdown} options={listMention} onChange={onTypesChange} name="id_mention" className={verfChamp.id_mention ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={props.nomMention} />
                                {verfChamp.id_mention ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>

                        </div>
                        <div className='grid px-4'>
                            <div className="col-8 field my-1 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Nom Parcours</label>
                                <InputText id="username2" value={infoMention.parcours} aria-describedby="username2-help" name='parcours' className={verfChamp.parcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                {verfChamp.parcours ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                            <div className="col-4 field my-1 flex flex-column">
                                <label htmlFor="username2" className="label-input-sm">Abbreviation </label>
                                <InputText id="username2" value={infoMention.libparcours} aria-describedby="username2-help" name='libparcours' className={verfChamp.libparcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { onInfoMention(e) }} />
                                {verfChamp.libparcours ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                            </div>
                        </div>


                    </form>
                    {identique ? <center><small id="username2-help" className="p-info block justify-content-center" style={{ fontWeight: 'bold' }}>Aucun changement ! </small></center> : null}

                    <div className='flex mt-3 mr-4 justify-content-center'>
                        <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-secondary ' label={charge.chajoute ? 'Modification...' : 'Modifier'} onClick={() => {
                            infoMention.id_mention != "" ?
                                infoMention.parcours != "" ?

                                    infoMention.libparcours != "" ?
                                        onSub()
                                        :
                                        setverfChamp({ parcours: false, libparcours: true, id_mention: false })
                                    :
                                    setverfChamp({ parcours: true, libparcours: false, id_mention: false })
                                :
                                setverfChamp({ parcours: false, libparcours: false, id_mention: true })
                        }} />
                    </div>
                </div>
            </Dialog>
            <Toast ref={toastTR} position="top-right" />
        </>
    )
}
