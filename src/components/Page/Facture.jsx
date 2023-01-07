import React from 'react'
import QRCode from 'react-qr-code'

export default function Facture() {
  return (
   
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={"hello world"}
          viewBox={`0 0 256 256`}
        />
  
  )
}
