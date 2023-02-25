import React from 'react'
import ReactToPrint from 'react-to-print'
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
export default function Affichage() {
    return (
        <div className='content'>

            <ReactToPrint trigger={() =>
                <Button icon={PrimeIcons.PRINT} className='p-button-sm p-button-primary ml-3 ' label={'Imprimer'} />
            } content={() => document.getElementById("imprimable")} />
            <div className='grid h-full ' id='imprimable' >
                <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-coluln flex-column " style={{ alignItems: 'center' }}>
                    <div className='flex flex-column '>
                        <center>
                            <h3 className='m-1'>JKHKDHFJSDKLH FKJDHFJKSDLHKFSD</h3>
                        </center>
                        <h4 className='m-1'>MENTION : jkhsdkhkfds</h4>
                        <h4 className='m-1'>Parcours : CM</h4>
                        <h4 className='m-1'>Classe : L3</h4>
                        <h4 className='m-1'>Nombre d'étudiants : 96</h4>
                    </div>
                    <label style={{ borderBottom: '1px solid black', height: '10px', width: '100%' }} ></label>
                </div>
                <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ alignItems: 'center' }}>
                    <h4>LISTE DES DISCIPLINES ENSEIGNEES</h4>
                </div>
                <div className="lg:col-4 md:col-4  md:flex-column   sm:col-4 col-4 sm:flex-column field my-0 flex lg:flex-row flex-column " style={{ alignItems: 'center' }}>
                    <div className='flex flex-column'>
                        <label htmlFor="">Année Universitaire : 2017-2018</label>
                        <div className='flex flex-column ml-5' style={{ width: '100%' }}>
                            <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='p-1 pr-5' >Nombre de Groupe de TD : 2</label>
                            <label style={{ fontSize: '1.1em', border: '1px solid grey' }} className='p-1 pr-5' >Nombre de Groupe de TP : 5</label>
                        </div>
                    </div>
                </div>
                <div className="col-12 flex-column " style={{ alignItems: 'center' }}>
                    <label className='pl-5' >(S5 et S6) : Parcours Communication Multimedia</label>
                    <table style={{borderCollapse: 'collapse', width: '100%', height: '101.625px'}} border="1">
                        {/* <colgroup><col style="width: 10.0245%;"><col style="width: 18.5506%;"><col style="width: 3.46209%;"><col style="width: 3.51376%;"><col style="width: 3.6171%;"><col style="width: 4.23718%;"><col style="width: 4.23718%;"><col style="width: 3.92714%;"><col style="width: 3.97881%;"><col style="width: 3.8238%;"><col style="width: 3.8238%;"><col style="width: 4.44387%;"><col style="width: 4.49554%;"><col style="width: 27.8517%;"></colgroup> */}
                        <tbody>
                            <tr style={{height: '19.5833px'}}>
                                <td style={{height: '82.0416px'}} rowspan="4">SEMETRE 5 ET 6</td>
                                <td style={{height: '40.0208px',textAlign: 'center'}} rowspan="2">ELEMENTS CONSTITUTIFS(EC)</td>
                                <td style={{height: '19.5833px'}}>&nbsp;</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}} colspan="4">ET</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}} colspan="3">ED</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}} colspan="3">EP</td>
                                <td style={{height: '19.5833px'}}>&nbsp;</td>
                            </tr>
                            <tr style={{height: '20.4375px'}}>
                                <td style={{height: '20.4375px'}}>Cr&eacute;dits</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>VH</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>BASE</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>GROUP</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>TOTAL</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>BASE</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>GROUP</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>TOTAL</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>BASE</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>GROUP</td>
                                <td style={{height: '20.4375px', textAlign: 'center'}}>TOTAL</td>
                                <td style={{height: '20.4375px', textAlign: 'left'}}>&nbsp;</td>
                            </tr>
                            <tr style={{height: '22.4375px'}}>
                                <td style={{height: '22.4375px'}}>Mod&eacute;lisatio&nbsp; 3D et Animation</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>3</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>74</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>18</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>1</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>18</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>32</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>2</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>64</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>24</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>5</td>
                                <td style={{height: '22.4375px', textAlign: 'center'}}>120</td>
                                <td style={{height: '22.4375px', textAlign: 'left'}}>Alin Nimbol</td>
                            </tr>
                            <tr style={{height: '19.5833px'}}>
                                <td style={{height: '19.5833px'}}>Base de donn&eacute;es et Mod&eacute;lisation 2</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>3</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>74</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>18</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>1</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>18</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>32</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>2</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>64</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>24</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>5</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}>120</td>
                                <td style={{height: '19.5833px', textAlign: 'left'}}>HAJALALAINA Aimee Richard</td>
                            </tr>
                            <tr style={{height: '19.5833px'}}>
                                <td style={{height: '19.5833px', textAlign: 'center'}} colspan="2">TOTAL</td>
                                <td style={{height: '19.5833px', textAlign: 'center'}}><strong>17</strong></td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}><strong>666</strong></td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}><strong>162</strong></td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}>&nbsp;</td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}><strong>162</strong></td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}>&nbsp;</td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}>&nbsp;</td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}><strong>576</strong></td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}>&nbsp;</td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}>&nbsp;</td>
                                <td style={{textAlign: 'center' ,height: '19.5833px'}}><strong>1080</strong></td>
                                <td style={{height: '19.5833px'}}>&nbsp;</td>
                            </tr>
                        </tbody>
                       
                    </table>
                </div>
            </div>
        </div>
    )
}
