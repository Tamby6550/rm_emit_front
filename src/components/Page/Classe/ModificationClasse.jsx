import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputMask } from 'primereact/inputmask'

import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'

export default function ModificationClasse(props) {

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }
    //Declaration useSatate
    const [verfChamp, setverfChamp] = useState({ libelle_classe: false, nbre_etud: false, anne_scolaire: false, id_parcours: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const [infoClasse, setinfoClasse] = useState({ libelle_classe: '', nbre_etud: '', anne_scolaire: '', id_parcours: '' });
    //DropDown
    const [listParcours, setlistParcours] = useState([{ label: '', value: '' }]);
    const [valueDropdown, setvalueDropdown] = useState(null);
    const [chargementDr, setchargementDr] = useState('')
    //DropDown Mention
    const [chargementDrMen, setchargementDrMen] = useState('')
    const [listMention, setlistMention] = useState([{ label: '', value: '' }]);
    const [valueDropdownM, setvalueDropdownM] = useState(null);
    //Identique
    const [identique, setidentique] = useState(false)

    const onVideInfo = () => {
        setvalueDropdown(null);
        setvalueDropdownM(null);
        setidentique(false)
        setinfoClasse({ libelle_classe: '', nbre_etud: '', anne_scolaire: '', id_parcours: '' });
    }

    const oninfoClasse = (e) => {
        setinfoClasse({ ...infoClasse, [e.target.name]: e.target.value })
    }


    //Get List Parcours
    const loadDataP = async (id_parcours) => {
        setchargementDr('Chargement...');
        await axios.get(props.url + `rechercheMention/${id_parcours}`)
        .then(
            (result) => {
                    setchargementDr('');
                    setlistParcours(result.data);
                }
            );
    }

    const chargeDataParcours = async (id_parcours) => {
        setTimeout(() => {
            loadDataP(id_parcours);
        }, 300)
    }

    //Get List Mention
    const loadDataM = async () => {
        await axios.get(props.url + `getIdMention`)
            .then(
                (result) => {
                    setlistMention(result.data);
                }
            );
    }

    const chargeDataMention = async (data) => {
        setchargementDrMen(props.data.nom_mention + '(' + props.data.abbrmention + ')')
        setchargementDr(props.data.nom_parcours + '(' + props.data.abbrparcours + ')')
        setinfoClasse({ id_classe: data.id_classe, libelle_classe: data.libelle_classe, nbre_etud: data.nbre_etud, anne_scolaire: data.anne_scolaire, id_parcours: data.id_parcours });
        setTimeout(() => {
            loadDataM();
        }, 500)
    }

    const onTypesChangePar = (e) => {
        setinfoClasse({ ...infoClasse, [e.target.name]: e.target.value })
        setvalueDropdown(e.value);
    }
    const onTypesChangeMent = (e) => {
        setidentique(false)

        setinfoClasse({ ...infoClasse,id_parcours:'', [e.target.name]: e.target.value })
        setvalueDropdownM(e.value);
        chargeDataParcours(e.value);
    }
    /**Style css */
    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: '#a79d34', border: '1px solid #a79d34'
    };
    /**Style css */
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
                <h4 className='mb-1'>Nouvelle Classe </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    //Ajout de donnees vers Laravel
    const onSub = async () => {
        if (infoClasse.libelle_classe == props.data.libelle_classe && infoClasse.nbre_etud == props.data.nbre_etud && infoClasse.anne_scolaire == props.data.anne_scolaire && infoClasse.id_parcours == props.data.id_parcours) {
            setidentique(true)
        } else {
            setidentique(false)
            setcharge({ chajoute: true });
            await axios.put(props.url + 'updateClasse', infoClasse)
                .then(res => {
                    //message avy @back
                    notificationAction(res.data.etat, 'Modification', res.data.message);
                    setcharge({ chajoute: false });
                    setTimeout(() => {
                        props.setrefreshData(1);
                        onVideInfo()
                        onHide('displayBasic2');
                    }, 900)
                })
                .catch(err => {
                    //message avy @back
                    notificationAction('error', 'Erreur', err.data.message);
                    console.log(err);
                    setcharge({ chajoute: false });
                });
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <>
            <Button icon={PrimeIcons.PENCIL} className='p-buttom-sm p-2  ' style={stylebtnRec} tooltip='Modifier' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargeDataMention(props.data) }} />
            <div className='grid w-full '>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-12 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Mention*</label>
                                    <Dropdown value={valueDropdownM} options={listMention} onChange={onTypesChangeMent} name="id_mention" className={verfChamp.id_parcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={chargementDrMen} />
                                    {verfChamp.id_parcours ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="col-12 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Parcours*</label>
                                    <Dropdown value={valueDropdown} options={listParcours} onChange={onTypesChangePar} name="id_parcours" className={verfChamp.id_parcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={chargementDr} />
                                    {verfChamp.id_parcours ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>
                            <div className="card">
                                <div className="p-fluid px-4 formgrid grid">
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="username2" className="label-input-sm">Libellé*</label>
                                        <InputText id="username2" value={infoClasse.libelle_classe} aria-describedby="username2-help" name='libelle_classe' className={verfChamp.libelle_classe ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { setinfoClasse({ ...infoClasse, libelle_classe: capitalize(e.target.value) }) }} />
                                        {verfChamp.libelle_classe ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                    </div>
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="username2" className="label-input-sm">Nbre Etudiant</label>
                                        <InputNumber id="username2" value={infoClasse.nbre_etud} aria-describedby="username2-help" name='nbre_etud' className={verfChamp.nbre_etud ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onValueChange={(e) => { oninfoClasse(e) }} />
                                        {verfChamp.nbre_etud ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                    </div>
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="username2" className="label-input-sm">A. Scolaire*</label>
                                        <InputMask id="username2" value={infoClasse.anne_scolaire} mask='9999-9999' aria-describedby="username2-help" name='anne_scolaire' className={verfChamp.anne_scolaire ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { oninfoClasse(e) }} />
                                        {verfChamp.anne_scolaire ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                    </div>

                                </div>
                            </div>
                        </form>
                        {identique ? <center><small id="username2-help" className="p-info block justify-content-center" style={{ fontWeight: 'bold' }}>Aucun changement ! </small></center> : null}

                        <div className='flex mt-3 mr-4 justify-content-end'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Modification...' : 'Modifier'} onClick={() => {
                              
                              infoClasse.id_parcours != "" ?
                                    infoClasse.libelle_classe != "" ?

                                        infoClasse.nbre_etud != "" ?
                                            infoClasse.anne_scolaire != "" ?
                                                onSub()
                                                :
                                                setverfChamp({ libelle_classe: false, nbre_etud: false, anne_scolaire: true, id_parcours: false })
                                            :
                                            setverfChamp({ libelle_classe: false, nbre_etud: true, anne_scolaire: false, id_parcours: false })
                                        :
                                        setverfChamp({ libelle_classe: true, nbre_etud: false, anne_scolaire: false, id_parcours: false })
                                    :
                                    setverfChamp({ libelle_classe: false, nbre_etud: false, anne_scolaire: false, id_parcours: true })
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div >
            <Toast ref={toastTR} position="top-right" />
        </ >
    )
}
