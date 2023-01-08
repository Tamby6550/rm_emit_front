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

export default function Recherche(props) {

    //Affichage notification Toast primereact (del :7s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }
    //Declaration useSatate
    const [verfChamp, setverfChamp] = useState({ id_mention: false, libelle_classe: false, nbre_etud: false, anne_scolaire: false, id_parcours: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const [infoClasse, setinfoClasse] = useState({ id_mention: '', libelle_classe: '', nbre_etud: '', anne_scolaire: '', id_parcours: '' });
    const [labelRech, setlabelRech] = useState({})
    //DropDown
    const [listParcours, setlistParcours] = useState([{ label: '', value: '' }]);
    const [valueDropdown, setvalueDropdown] = useState(null);
    const [chargementDr, setchargementDr] = useState('')
    //DropDown Mention
    const [chargementDrMen, setchargementDrMen] = useState('')
    const [listMention, setlistMention] = useState([{ label: '', value: '' }]);
    const [valueDropdownM, setvalueDropdownM] = useState(null);

    const onVideInfo = () => {
        setvalueDropdown(null);
        setvalueDropdownM(null);
        setinfoClasse({ libelle_classe: '', nbre_etud: '', anne_scolaire: '', id_parcours: '' });
    }

    const oninfoClasse = (e) => {
        setinfoClasse({ ...infoClasse, [e.target.name]: e.target.value })
    }



    //Get List Parcours
    const loadDataP = async (id_parcours) => {
        await axios.get(props.url + `rechercheMention/${id_parcours}`)
            .then(
                (result) => {
                    setlistParcours(result.data);
                    setchargementDr('');
                }
            );
    }
    const chargeDataParcours = async (id_parcours) => {
        setchargementDr('Chargement...')
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
                    setchargementDrMen('')
                }
            );
    }


    const chargeDataMention = async () => {
        setchargementDrMen('Chargement...')
        setTimeout(() => {
            loadDataM();
        }, 500)
    }

    const onTypesChangePar = (e) => {
        setinfoClasse({ ...infoClasse, [e.target.name]: e.target.value })
        setvalueDropdown(e.value);
    }
    const onTypesChangeMent = (e) => {
        setinfoClasse({ ...infoClasse, [e.target.name]: e.target.value })
        setvalueDropdownM(e.value);
        chargeDataParcours(e.value);
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
                <h4 className='mb-1'>Nouvelle Classe </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */

    //Ajout de donnees vers Laravel
    const onSub = async () => {
        console.log(infoClasse)
        setcharge({ chajoute: true });
        await axios.post(props.url + 'rechercheClasseParcoursMention', infoClasse)
            .then(res => {
                props.setlistClasse(res.data);
                props.setinfoClasse(infoClasse)
                setcharge({ chajoute: false });
                onHide('displayBasic2');
            })
            .catch(err => {
                console.log(err);
                //message avy @back
                notificationAction('error', 'Erreur', err.data.message);
                setcharge({ chajoute: false });
            });
    }

    return (
        <div>
            <Button icon={PrimeIcons.SEARCH} className='p-buttom-sm p-button-secondary' tooltip='Recherche' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); chargeDataMention() }} />
            <div className='grid w-full '>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-12 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" >
                        <form className='flex flex-column justify-content-center'>
                            <div className='grid px-4'>
                                <div className="col-12 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Mention*</label>
                                    <Dropdown value={valueDropdownM} options={listMention} onChange={onTypesChangeMent} name="id_mention" className={verfChamp.id_parcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={chargementDrMen} />
                                    {verfChamp.id_mention ? <small id="username2-help" className="p-error block">Critère minimun !</small> : null}
                                </div>
                                <div className="col-12 field my-1 flex flex-column">
                                    <label htmlFor="username2" className="label-input-sm">Parcours</label>
                                    <Dropdown value={valueDropdown} options={listParcours} onChange={onTypesChangePar} name="id_parcours" className={verfChamp.id_parcours ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} placeholder={chargementDr} />
                                    {verfChamp.id_parcours ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>
                            <div className="card">
                                <div className="p-fluid px-4 formgrid grid">
                                    <div className="field col-12 md:col-4">
                                        <label htmlFor="username2" className="label-input-sm">Anne scolaire*</label>
                                        <InputMask id="username2" value={infoClasse.anne_scolaire} mask='9999-9999' aria-describedby="username2-help" name='anne_scolaire' className={verfChamp.anne_scolaire ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} onChange={(e) => { oninfoClasse(e) }} />
                                        {verfChamp.anne_scolaire ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className='flex mt-3 mr-4 justify-content-end'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Recherche...' : 'Recherche'} onClick={() => {
                                if (infoClasse.id_mention == '') {
                                    setverfChamp({ id_mention: true });
                                } else {
                                    setverfChamp({ id_mention: false });
                                    onSub()
                                }
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div >
            <Toast ref={toastTR} position="top-right" />
        </div >
    )
}
