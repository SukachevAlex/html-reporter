import React from 'react';

interface IMyCanvasComponent{
    url: string;
    refs?: any;
}

export default class CanvasComponent extends React.Component<IMyCanvasComponent> {
    constructor(props: IMyCanvasComponent) {
        super(props);
    }
    componentDidMount() {
        this.updateCanvas();
    }
    updateCanvas() {

        function matrixArray(pix: Uint8ClampedArray, rows: number, columns: number){
            const arr = new Array();
            for (var i = 0; i < rows; i++) {
              arr[i] = new Array();
              for (var j = 0; j < columns; j++) {
                    const idx = 4 * i * columns + j * 4;
                    arr[i][j] = [pix[idx], pix[idx + 1], pix[idx + 2], pix[idx + 3]];
              }
            }
            return arr;
        }

        const canv: any = this.refs.canvas;
        const ctx = canv.getContext('2d');
        let canvWidth = 0;
        let canvHeight = 0;
        const imageObj = new Image();
        imageObj.src = this.props.url;

        const drawImage = (image: any) => {
            canv.width = image.width;
            canv.height = image.height;
            canvWidth = image.width;
            canvHeight = image.height;
          
            ctx && ctx.drawImage(image, 0, 0);
        };

        imageObj.onload = function() {
            drawImage(this);
            const imgd = ctx && ctx.getImageData(0, 0, canvWidth, canvHeight);
            const pix = imgd && imgd.data;
            const pixMatr = pix && matrixArray(pix, canvHeight, canvWidth);

            const boundBoxArr = [];
            const tol = 5;
            const minSquare = 100;

            for (let i = 0; i < canvHeight; i++) {
                for (let j = 0; j < canvWidth; j++) {
                    if (pixMatr[i][j][0] == 255 && pixMatr[i][j][1] == 0 && pixMatr[i][j][2] == 255) {

                        let flag = 0;

                        boundBoxArr.forEach((elem: number[]) => {
                            const row = elem;
                            if (row[0] - tol <= i && i <= row[1] + tol && row[2] - tol <= j && j <= row[3] + tol){
                                flag = 1;
                                row[0] = Math.min(i - 1, row[0]);
                                row[1] = Math.max(i + 1, row[1]);
                                row[2] = Math.min(j - 1, row[2]);
                                row[3] = Math.max(j + 1, row[3]);
                            }
                        });

                        if (!flag){
                            boundBoxArr.push([i, i + 1, j, j + 1]);
                        }
                    }
                }
            }

            for (let i = 0; i < canvHeight; i++) {
                for (let j = 0; j < canvWidth; j++) {
                    const idx = 4 * i * canvWidth + j * 4;
                    pix[idx] = pixMatr[i][j][0];
                    pix[idx + 1] = pixMatr[i][j][1];
                    pix[idx + 2] = pixMatr[i][j][2];
                    pix[idx + 3] = pixMatr[i][j][3];
                }
            }

            ctx.putImageData(imgd, 0, 0);

            boundBoxArr.forEach((elem) => {
                ctx.fillStyle = 'rgba(255,0,255,0.25)';
                const x1 = elem[2];
                const x2 = elem[3]; 
                const x =  x1 + (x2 - x1) / 2;

                const y1 = elem[0];
                const y2 = elem[1]; 
                const y = y1 + (y2 - y1) / 2;
                if ((x2 - x1) * (y2 - y1) < minSquare && (x2 - x1) < 20 && (y2 - y1) < 20){
                    ctx.moveTo(x, y);
                    ctx.arc(x, y, 10, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
        };
    }
    render() {
        return (
            <canvas ref='canvas' style={{width: '100%'}} />
        );
    }
}