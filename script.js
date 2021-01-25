class GalaxiaController {
    confereDia(mes, ano) {
        let data = new Date(ano, mes, 0);
        return data.getDate();
    }
    coletaData() {
        let data = document.querySelector("#Data").value;
        return data;
    }
    buscaGalaxia(data) {
        let model = new GalaxiaModel();
        model.buscaDadosGalaxia(data);
    }
    proximaGalaxia(data) {
        let dataArr = data.split("-");
        // dataArr[0] é o ano
        // dataArr[1] é o mês
        // dataArr[2] é o dia
        let contDia = this.confereDia(dataArr[1], dataArr[0]);
        console.log(contDia);
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
    constructor() {
        this._title = "";
        this._date = "";
        this._explanation = "";
        this._image = "";
        this._copyright = "";
    }
    get tittle() {
        return this._title;
    }
    get image() {
        return this._image;
    }
    buscaDadosGalaxia(data) {
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
                let view = new GalaxiaView(this._title, this._date, this._explanation, this._image, this._copyright);
                view.mostraGalaxia();
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
        this._elementoCopyright.innerText = `${copyright}`;
        this._elementoImage.setAttribute("src", img);
    }
    mostraGalaxia() {
        document.querySelector("#Titulo").appendChild(this._elementoTitle);
        document.querySelector("#Data").appendChild(this._elementoImgDate);
        document.querySelector("#Explicacao").appendChild(this._elementoExplanation);
        document.querySelector("#Imagem").appendChild(this._elementoImage);
        document.querySelector("#Copyright").appendChild(this._elementoCopyright);
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