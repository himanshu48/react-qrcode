import React, { useEffect, useState } from 'react';
import './container.css';
import './App.css';
import QRCode from 'qrcode';
import QrCode from 'qrcode-reader';
import Jimp from 'jimp';

// const errorCorrectionLevel = ['L', 'M', 'Q', 'H'];

function App() {

  const [qrtext, setQrtext] = useState('Sample text');

  useEffect(() => {
    QRCode.toCanvas(document.getElementById('qrcode'), qrtext,{ errorCorrectionLevel: 'M' }, function (error) {
      if (error) console.error(error)
      console.log('success!');
    })
  }, [qrtext])

  const handleTextarea = (e) => {
    e.preventDefault();
    setQrtext(e.target.value)
  }
  const handleImageInput = (e) => {
    e.preventDefault();
    // e.target.files
    const fileReader = new FileReader();
    var qr = new QrCode();
    qr.callback = function(err, value) {
        if (err) {
            console.error(err);
            // TODO handle error
        } else {
          console.log(value.result);
        }
    };
// 548 * 548
    fileReader.onload = function (e) {
      Jimp.read(fileReader.result)
          .then(image => {
            image.resize(276, Jimp.AUTO);
            // image.resize(300, 250);
            image.getBase64Async(Jimp.MIME_JPEG).then(data => {
              qr.decode(data);
            })
          })
          .catch(err => {
            console.log(err)
          });
    }
    fileReader.readAsDataURL(e.target.files[0]);
  }

  return (
    <div className="container">
      <div className="row" style={{marginTop:'50px'}}>
        <div className="col-6 col-md-7">
          <textarea rows="30" cols="60" value={qrtext} onChange={handleTextarea}></textarea>
        </div>
        <div className="col-6 col-md-5">
          <canvas id="qrcode"></canvas>
        </div>
      </div>
      <div className="row" style={{marginTop:'50px'}}>
        <div className="col-md-3">
            <input onChange={handleImageInput} type="file" />
        </div>
      </div>
    </div>
  );
}

export default App;
