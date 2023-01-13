import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
/*Importer modal */
import { Dialog } from 'primereact/dialog';
import axios from 'axios'
import { Fieldset } from 'primereact/fieldset';


export default function AjoutDetails(props) {

    //Declaration useSatate
    const [infoDetails, setinfoDetails] = useState({ base_et: '', group_et: '', base_ed: '', group_ed: '', base_ep: '', group_ep: '', vheure: '', credit: '', mati_id: '' });
    const [verfChamp, setverfChamp] = useState({ vheure: false });
    const [charge, setcharge] = useState({ chajoute: false });
    const onVideInfo = () => {
        setinfoDetails({ base_et: '', group_et: '', base_ed: '', group_ed: '', base_ep: '', group_ep: '', vheure: '', credit: '', mati_id: '' });
    }


    //Affichage notification Toast primereact (del :3s )
    const toastTR = useRef(null);
    const notificationAction = (etat, titre, message) => {
        toastTR.current.show({ severity: etat, summary: titre, detail: message, life: 3000 });
    }

    const [selecttarif, setselecttarif] = useState(null);
    const [selecttype, setselecttype] = useState(null);
    const onTarifChange = (e) => {
        setselecttarif(e.value);
        setinfoDetails({ ...infoDetails, [e.target.name]: (e.target.value) });
    }
    const onTypesChange = (e) => {
        setselecttype(e.value);
        setinfoDetails({ ...infoDetails, [e.target.name]: (e.target.value) });
    }
    const onInfoDetails = (e) => {
        setinfoDetails({ ...infoDetails, [e.target.name]: (e.target.value) })
    }

    const idExamen = (totalenrg) => {
        let id1 = parseInt(totalenrg) + 1;
        let id2 = parseInt(totalenrg) + 2;
        setinfoDetails({ ...infoDetails, id_exam: totalenrg, id_exam1: id1, id_exam2: id2 });
    }
    const controleChampVide = () => {
        if (!Number.isInteger(infoDetails.montant_e)) {
            setverfChamp({ ...verfChamp, montant_e: true })
        }
        if (!Number.isInteger(infoDetails.montant_l1)) {
            setverfChamp({ ...verfChamp, montant_l1: true })
        }
        if (!Number.isInteger(infoDetails.montant_l2)) {
            setverfChamp({ ...verfChamp, montant_l2: true })
        }

        // if (infoDetails.tarif == "") {
        //     setverfChamp({ ...verfChamp, tarif: true })
        // }

        if (infoDetails.type == "") {
            setverfChamp({ ...verfChamp, type: true })
        }

        if (infoDetails.code_tarif == "") {
            setverfChamp({ ...verfChamp, code_tarif: true })
        }

        if (infoDetails.lib == "") {
            setverfChamp({ ...verfChamp, lib: true })
        }


        if (infoDetails.lib != "" && infoDetails.code_tarif != "" && infoDetails.type != "" && Number.isInteger(infoDetails.montant_e) && Number.isInteger(infoDetails.montant_l1) && Number.isInteger(infoDetails.montant_l2)) {
            setverfChamp({ id_exam: false, lib: false, code_tarif: false, montant_e: false, montant_l1: false, montant_l2: false });
            onSub()
        }

    }

    const stylebtnRec = {
        fontSize: '1rem', padding: ' 0.8375rem 0.975rem', backgroundColor: 'rgb(72 96 112)', border: '1px solid rgb(72 96 112)'
    };

    const choixType = [
        { label: 'ECHOGRAPHIE', value: 'ECHOGRAPHIE' },
        { label: 'MAMMOGRAPHIE', value: 'MAMMOGRAPHIE' },
        { label: 'PANNORAMIQUE DENTAIRE', value: 'PANNORAMIQUE DENTAIRE' },
        { label: 'SCANNER', value: 'SCANNER' },
        { label: 'RADIOGRAPHIE', value: 'RADIOGRAPHIE' },
        { label: 'ECG', value: 'ECG' },
        { label: 'AUTRES', value: 'AUTRES' }
    ]
    const choixTarif = [
        { label: 'E', value: 'E' },
        { label: 'L1', value: 'L1' },
        { label: 'L2', value: 'L2' }
    ]

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
        setverfChamp({ id_exam: false, lib: false, code_tarif: false, type: false, montant: false, tarif: false });
        onVideInfo();
        setselecttype(null);
        setselecttarif(null);
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
                <h4 className='mb-1'>Ajout details </h4>
                <hr />
            </div>
        );
    }
    /** Fin modal */




    const onSub = async () => { //Ajout de donnees vers Laravel

        setcharge({ chajoute: true });
        await axios.post(props.url + 'insertExamen', infoDetails)
            .then(res => {
                notificationAction(res.data.etat, 'Enregistrement', res.data.message);//message avy @back
                setcharge({ chajoute: false });
                setTimeout(() => {
                    props.setrefreshData(1);
                    onVideInfo()
                    onHide('displayBasic2');
                }, 900)
            })
            .catch(err => {
                console.log(err);
                notificationAction('error', 'Erreur', err.data.message);//message avy @back
                setcharge({ chajoute: false });
            });
    }
    return (
        <div>
            <Toast ref={toastTR} position="top-right" />
            <Button icon={PrimeIcons.PLUS} className='p-buttom-sm p-1 ' label='' style={stylebtnRec} tooltip='Ajouter details' tooltipOptions={{ position: 'top' }} onClick={() => { onClick('displayBasic2'); idExamen(props.totalenrg) }} />
            <div className='grid'>
                <Dialog header={renderHeader('displayBasic2')} visible={displayBasic2} className="lg:col-5 md:col-8 col-9 p-0" footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                    <div className="p-1 style-modal-tamby" style={{fontSize:'0.9em'}} >
                        <form className='flex flex-column justify-content-center'>

                            <div className='grid px-4 flex justify-content-center'>
                                <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                    <h4 className='m-1'>Volmue d'heure</h4>
                                    <InputNumber inputId="withoutgrouping"  value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                                <div className="lg:col-4 col-12 ml-3 field my-0 flex flex-column">
                                    <h4 className='m-1'>Credit</h4>
                                    <InputNumber inputId="withoutgrouping" value={infoDetails.credit} name="credit" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                    {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                </div>
                            </div>
                            <div className='grid px-4'>
                                <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                    <Fieldset legend="Enseignement Théorique "  >
                                        <div className='grid p-1'>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Base</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                                {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Groupe</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                                {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Total</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} readOnly />
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                            </div>
                            <div className='grid px-4'>
                                <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                    <Fieldset legend="Enseignement Dirigé "  >
                                        <div className='grid p-1'>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Base</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                                {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Groupe</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                                {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Total</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} readOnly />
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                            </div>
                            <div className='grid px-4'>
                                <div className="lg:col-12 col-12 field my-0 flex flex-column">
                                    <Fieldset legend="Enseignement Pratique "  >
                                        <div className='grid p-1'>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Base</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                                {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Groupe</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} className={verfChamp.vheure ? "form-input-css-tamby p-invalid" : "form-input-css-tamby"} />
                                                {verfChamp.vheure ? <small id="username2-help" className="p-error block">Champ vide !</small> : null}
                                            </div>
                                            <div className="lg:col-4 col-12 field my-0 flex flex-column">
                                                  <h4 className='m-1'>Total</h4>
                                                <InputNumber inputId="withoutgrouping" value={infoDetails.vheure} name="vheure" onValueChange={onInfoDetails} mode="decimal" useGrouping={false} readOnly />
                                            </div>
                                        </div>
                                    </Fieldset>
                                </div>
                            </div>
                           
                          
                           

                        </form>
                        <div className='flex mt-3 mr-4 justify-content-center'>
                            <Button icon={PrimeIcons.SAVE} className='p-button-sm p-button-primary ' label={charge.chajoute ? 'Enregistrement...' : 'Enregistrer'} onClick={() => {
                                controleChampVide()
                            }} />
                        </div>
                    </div>
                </Dialog>
            </div>
        </div>
    )
}
