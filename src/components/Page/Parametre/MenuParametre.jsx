import React, { useState, useEffect, useRef } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import Parametre from './Parametre';
import Parametre2 from './Parametre2';
export default function MenuAffichage(props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="tabview-demo">
      <div className="card">
        <TabView activeIndex={activeIndex} onTabChange={(e)=>{ setActiveIndex(e.index) }} >
          <TabPanel header="PARAMETRE 1"   >
            <Parametre url={props.url} urlip={props.urlip} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
          <TabPanel header="PARAMETRE 2"   >
            <Parametre2 url={props.url} urlip={props.urlip} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}

