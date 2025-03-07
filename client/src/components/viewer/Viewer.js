import WebViewer from '@pdftron/webviewer';
import { initializeHTMLViewer } from '@pdftron/webviewer-html';
import React, { useContext, useEffect, useRef, useState } from 'react';
import WebViewerContext from '../../context/webviewer';
import './Viewer.css';

const Viewer = ({ res, loadURL }) => {
  const viewer = useRef(null);
  const beenInitialised = useRef(false);
  const [HTMLModule, setHTMLModule] = useState(null);
  const { setInstance } = useContext(WebViewerContext);

  useEffect(() => {
    if (!beenInitialised.current) {
      beenInitialised.current = true;
      WebViewer.Iframe(
        {
          path: '/lib',
          disableVirtualDisplayMode: true,
        },
        viewer.current
      ).then(async (instance) => {
        setInstance(instance);

        const license = `---- Insert commercial license key here after purchase ----`;

        // Extends WebViewer to allow loading HTML5 files from URL or static folder.
        const htmlModule = await initializeHTMLViewer(instance, { license });

        setHTMLModule(htmlModule);
        
        loadURL(`https://docs.apryse.com/documentation/web/guides/html/load-html/`);
        instance.Core.documentViewer.addEventListener('documentLoaded', () => {
          const string = `<?xml version="1.0" encoding="UTF-8"?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><fields/><annots><text page="0" rect="630.95,4489.86,661.95,4520.86" color="#FFCD45" flags="print,nozoom,norotate" name="32f9624f-dcf4-e5f3-3cd0-661089bd969b" title="And'rii Adminenchuk" subject="Note" date="D:20250307143628+01'00'" StrokeThickness="1" creationdate="D:20250307143628+01'00'" icon="Comment" statemodel="Review"><trn-custom-data bytes="{&quot;annotationNumber&quot;:&quot;1&quot;}"/></text><square page="0" rect="169.41,9425.52,694.34,9764.35" color="#E44234" flags="print" name="792cbc53-1979-745a-75d2-bca918a7a65e" title="And'rii Adminenchuk" subject="Rectangle" date="D:20250307144553+01'00'" StrokeThickness="1" creationdate="D:20250307143656+01'00'"><trn-custom-data bytes="{&quot;annotationNumber&quot;:&quot;2&quot;,&quot;trn-mention&quot;:&quot;{\&quot;contents\&quot;:\&quot;123444\&quot;,\&quot;ids\&quot;:[]}&quot;,&quot;trn-attachments&quot;:&quot;[]&quot;}"/><contents>123444</contents><contents-richtext><body><p><span>123444</span></p></body></contents-richtext></square><square page="0" rect="187.38,4752.52,586.53,5048.99" color="#E44234" flags="print" name="3f7421fd-f032-6464-c7a7-4fba55a1b837" title="And'rii Adminenchuk" subject="Rectangle" date="D:20250307144455+01'00'" StrokeThickness="1" creationdate="D:20250307144451+01'00'" dashes=""><trn-custom-data bytes="{&quot;annotationNumber&quot;:&quot;3&quot;,&quot;trn-mention&quot;:&quot;{\&quot;contents\&quot;:\&quot;123\&quot;,\&quot;ids\&quot;:[]}&quot;,&quot;trn-attachments&quot;:&quot;[]&quot;}"/><contents>123</contents><contents-richtext><body><p><span>123</span></p></body></contents-richtext></square></annots></xfdf>`
          instance.Core.annotationManager.importAnnotations(string);
        });

        /* How to proxy with custom HTTP headers */
        // loadURL(`https://www.pdftron.com/`, {
        //   customheaders: JSON.stringify({
        //     Authorization: 'token',
        //     'custom-header': 'custom token',
        //   }),
        //   // invalid values: {}, { key: value }, "random string that can't be parsed"
        // });
      });
    }
  }, [loadURL, setInstance]);

  useEffect(() => {
    if (HTMLModule && Object.keys(res).length > 0) {
      const { iframeUrl, width, height, urlToProxy } = res;
      HTMLModule.loadHTMLPage({ iframeUrl, width, height, urlToProxy });
    }
  }, [HTMLModule, res]);

  return <div ref={viewer} className="HTMLViewer"></div>;
};

export default Viewer;
