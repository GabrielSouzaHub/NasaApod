class GalaxiaController {
    coletaData() {
        let data = document.querySelector("#Data").value;
        return data;
    }
    dataAtual(){
        let atual = new Date();
        let dia = atual.getDate();
        let mes = atual.getMonth();
        let ano = atual.getFullYear();
        mes++;
        if(dia.toString().length==1){
            dia='0'+dia;
        }
        if(mes.toString().length==1){
            mes='0'+mes;
        }
        let dataAtual = `${ano}-${mes}-${dia}`;
        return dataAtual;
    }
    buscaGalaxia(data) {
        let model = new GalaxiaModel();
        model.buscaDadosGalaxia(data, () =>{
        let view = new GalaxiaView(model.title, model.date, model.explanation, model.image, model.copyright);
        view.mostraGalaxia();
        });
    }
    confereDia(mes, ano) {
        let data = new Date(ano, mes, 0);
        return data.getDate();
    }
    proximaGalaxia(data) {
        if(data==""||data==this.dataAtual()) return;
        let dataArr = data.split("-");
        // dataArr[0] é o ano
        // dataArr[1] é o mês
        // dataArr[2] é o dia
        let contDia = this.confereDia(dataArr[1], dataArr[0]);
        //altera ano
        if (dataArr[1] == 12 && dataArr[2] == 31) {
            dataArr[2] = '0' + 1;
            dataArr[1] = '0' + 1;
            dataArr[0]++;
        }
        //altera dia
        else if (dataArr[2] < contDia) {
            dataArr[2]++;
            if (dataArr[2].toString().length == 1) {
                dataArr[2] = '0' + dataArr[2];
            }
        }
        //altera mês
        else if (dataArr[2] == contDia) {
            dataArr[1]++;
            if (dataArr[1].toString().length == 1) {
                dataArr[1] = '0' + dataArr[1];
            }
            dataArr[2] = '0' + 1;
        }
        data = dataArr.join("-");
        document.querySelector("#Data").value = data;
        this.buscaGalaxia(data);
    }
    voltaGalaxia(data) {
        if(data=="") data = this.dataAtual();
        let dataArr = data.split("-");
        // dataArr[0] é o ano
        // dataArr[1] é o mês
        // dataArr[2] é o dia
        let contDia = this.confereDia(dataArr[1], dataArr[0]);
        //altera ano
        if (dataArr[1] == 1 && dataArr[2] == 1) {
            dataArr[2] = 31;
            dataArr[1] = 12;
            dataArr[0]--;
        }
        //altera dia
        else if (dataArr[2] > 1) {
            dataArr[2]--;
            if (dataArr[2].toString().length == 1) {
                dataArr[2] = '0' + dataArr[2];
            }
        }
        //altera mês
        else if (dataArr[2] == 1) {
            dataArr[1]--;
            dataArr[1] = '0' + dataArr[1];
            dataArr[2] = contDia = this.confereDia(dataArr[1], dataArr[0]);
        }
        data = dataArr.join("-");
        document.querySelector("#Data").value = data;
        this.buscaGalaxia(data);
    }


}

class GalaxiaModel {
    //comecei-!
    constructor() {
        this._title = "";
        this._date = "";
        this._explanation = "";
        this._image = "";
        this._copyright = "";
    }
    get title() {
        return this._title;
    }
    get date() {
        return this._date;
    }
    get explanation() {
        return this._explanation;
    }
    get image() {
        return this._image;
    }
    get copyright() {
        return this._copyright;
    }
    buscaDadosGalaxia(data,callback) {
        let request = new XMLHttpRequest();

        request.open("GET", `https://api.nasa.gov/planetary/apod?api_key=YSeU2JGke6SQQ1LP50j9ReXJIB17oURCJInC8ITK&date=${data}`);
        request.addEventListener("load", () => {
            if (request.status == 200) {
                let response = JSON.parse(request.responseText);
                this._title = response.title;
                this._date = response.date;
                this._explanation = response.explanation;
                this._image = response.hdurl;
                this._copyright = response.copyright;
                callback();
            }
            else {
                console.log(request.status);
            }
        })
        request.send();
    }

}

class GalaxiaView {
    constructor(title, imgDate, explanation, img, copyright) {
        this._elementoTitle = document.getElementById("titP");
        this._elementoImgDate = document.getElementById("datP");
        this._elementoExplanation = document.getElementById("expP");
        this._elementoCopyright = document.getElementById("copP");
        this._elementoImage = document.getElementById("imgP");

        this._elementoTitle.innerText = `${title}`;
        this._elementoImgDate.innerText = `${imgDate}`;
        this._elementoExplanation.innerText = `${explanation}`;
        if(copyright!=undefined) this._elementoCopyright.innerText = `${copyright} \u00a9`;
        else this._elementoCopyright.innerText = `Não possui.`;
        this._elementoImage.setAttribute("src", img);
    }
    mostraGalaxia() {
        document.querySelector(".titulo").appendChild(this._elementoTitle);
        document.querySelector(".data").appendChild(this._elementoImgDate);
        document.querySelector(".explicacao").appendChild(this._elementoExplanation);
        document.querySelector(".imagem").appendChild(this._elementoImage);
        document.querySelector(".copyright").appendChild(this._elementoCopyright);
    }
}


let controller = new GalaxiaController();
controller.buscaGalaxia(controller.coletaData());

document.getElementById("chamaNasa").addEventListener("click", function () {
    controller.buscaGalaxia(controller.coletaData());
});

document.getElementById("proximoB").addEventListener("click", function () {
    controller.proximaGalaxia(controller.coletaData());
});

document.getElementById("anteriorB").addEventListener("click", function () {
    controller.voltaGalaxia(controller.coletaData());
});