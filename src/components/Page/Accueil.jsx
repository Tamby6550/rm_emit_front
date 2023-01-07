import { PrimeIcons } from 'primereact/api'
import { Card } from 'primereact/card'
import React from 'react'

export default function Accueil() {
    return (
        <div className='grid h-full'>
            <div className='col-12 pt-0'>
                <h3 className='text-center m-0 text-surface-500'>Bienvenue dans RM_EMIT <span className={PrimeIcons.CLOUD}></span></h3>
            </div>
            <div className="lg:col-4 md:col-12 sm:col-12 col-12">
                <Card ><p className='text-center'>Information du jour</p></Card>
            </div>
            <div className="lg:col-4 md:col-12 sm:col-12 col-12">
                <Card ><p className='text-center'>Information du jour</p></Card>
            </div>
            <div className="lg:col-4 md:col-12 sm:col-12 col-12">
                <Card ><p className="text-center">Information du jour</p></Card>
            </div>
            <div className='col-12 h-full'>
                <Card className='w-full h-full'>
                    <p className='text-center h-full'>Statistique</p>
                </Card>
            </div>
        </div>
    )
}
