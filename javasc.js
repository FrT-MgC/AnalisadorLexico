var posicoes = [[]];
var palavras = [];
var alfabeto = [];
var lugar = 0;

const Primeiraletra = 'a';
const Ultimaletra = 'z';

$("#Input").on('keyup', function(e){
    if(e.keyCode == 32){//verifica espaco
        let input = $(this);
        let CurrentPalavra = input.val();

        inserePalavra(input, CurrentPalavra);

        input.val('');
    }}
);

//Adiciona Token no Array
$("#Botao").click(function(){
    //botao de inserir
    let input = $('#Input');
    let CurrentPalavra = input.val();

    inserePalavra(input, CurrentPalavra);

    input.val('');
});

$("#Limpalista").click(function(){
    
    $("#lista .palavras").remove(); 
        palavras = [];
        posicoes = [[]];
        alfabeto = [];
        lugar = 0;
    
    //seta estados da tabela vazia
    definePosicoes();
    defineTabela();

});


//captura as teclas pressionadas
$("#Valida").on('keyup', function(e){//e = eventos do proprio js
    let input = $(this);//this vai ser a função ali em cima "validateInput"
    let CurrentPalavra = input.val();

    //chama funcao de validacao na tabela
    ConfereLexema(input, CurrentPalavra, e.keyCode);
});

function inserePalavra(input, entrada){
    entrada = entrada.trim();

    if(entrada.length > 0){
        if(palavras.indexOf(entrada) < 0){
            palavras.push(entrada);
            definePosicoes();
        }
    }

    defineTabela();
    console.log(entrada);
    
    let Listar = '<div class="palavras"><span class="text">'+ entrada +'</span></div>';

$('#lista').append(Listar);

return true;

};


function definePosicoes(){
        
    //percorre a palavra
    for(let i = 0; i < palavras.length; i++){
        let CurrentEtapa = 0;
        let entrada = palavras[i];
    
        //percorre as letras da palvra
        for(let j = 0; j < entrada.length; j++){
            let letra = entrada[j];
                
            if(typeof posicoes[CurrentEtapa][letra] === 'undefined'){
                let ProximaEtapa = lugar + 1;
    
                posicoes[CurrentEtapa][letra] = ProximaEtapa;
                posicoes[ProximaEtapa] = [];
                    
                lugar = CurrentEtapa = ProximaEtapa;
    
            } else {
                CurrentEtapa = posicoes[CurrentEtapa][letra];
            }
    
            //verifica se chegou na ultima letra
            if(j == entrada.length - 1){
                posicoes[CurrentEtapa]['end'] = true;
            } else {
                posicoes[CurrentEtapa]['end'] = false;
            }   
        }
    }
        console.log(posicoes);
};

function defineTabela(){
    let CopiaPosicoes = [];

    //Percorre Posicoes
    for(let i = 0; i < posicoes.length; i++){
        let aux = [];
        
        aux['posicao'] = i;

        //Percorre de A a Z
        for(let j = Primeiraletra.charCodeAt(0); j <= Ultimaletra.charCodeAt(0); j++){
            let letra = String.fromCharCode(j);
            
            if(typeof posicoes[i][letra] === 'undefined'){
                aux[letra] = ' ';
            } else {
                aux[letra] = posicoes[i][letra];
            }
        }

        if(posicoes[i]['end']){
            aux['end'] = true;
        } else {
            aux['end'] = false;
        }

        CopiaPosicoes.push(aux);
    }

    alfabeto = CopiaPosicoes;

    //cria tabela
    let tabela = $('#tabela');
    tabela.html('');

    let inicio = $(document.createElement('th'));
    let linha = $(document.createElement('tr'));

    inicio.html('Estados');

    linha.append(inicio);
    tabela.append(linha);

    //Colocar letras de A-Z na tabela
    for(let i = Primeiraletra.charCodeAt(0); i <= Ultimaletra.charCodeAt(0); i++){
        let inicio = $(document.createElement('th')); 
        inicio.append(String.fromCharCode(i))
        linha.append(inicio);
    }

    //Estados
    for(let j = 0; j < CopiaPosicoes.length; j++){
        let linha = $(document.createElement('tr'));
        let localtabela = $(document.createElement('td'));

        if(CopiaPosicoes[j]['end']){
            localtabela.html('q' + CopiaPosicoes[j]['posicao'] + '*');
            localtabela.addClass('end');
            linha.addClass('end');
        } else {
            localtabela.html('q' + CopiaPosicoes[j]['posicao']);
        }

        linha.append(localtabela);
        linha.addClass(`step_${j}`);

        //Letras/Tokens
        for (var m = Primeiraletra.charCodeAt(0); m <= Ultimaletra.charCodeAt(0); m++) {
            let centro = $(document.createElement('td'));
            let letra = String.fromCharCode(m);

            centro.html(CopiaPosicoes[j][letra]);

            if(CopiaPosicoes[j][letra] != ' '){
                centro.addClass('lugar');
            } else {
                centro.addClass('vazio');
            }

            linha.append(centro);
        }

        tabela.append(linha);
    }


};

function ConfereLexema(input, entrada, acao){
    //Se for válido, Espaço, Backspace ou Del
    if(entrada || acao == 32 || acao == 8 || acao == 46){
        if(palavras.length > 0){
            //Limpa CSS linhas
            $("#tabela tr td").removeClass('verde');
            $("#tabela tr").removeClass('vermelho');
            $("#tabela tr").removeClass('currentetapa');
            $("#tabela tr").removeClass('fim');

            let currentEtapa = 0;
            let erro = false;
            
            for(let i = 0; i < entrada.length; i++){
                let letra = entrada[i];
                
                if(!erro){
                    //Se está dentro do alfabeto
                    if(letra.charCodeAt(0) >= Primeiraletra.charCodeAt(0) && letra.charCodeAt(0) <= Ultimaletra.charCodeAt(0)){
                        if(alfabeto[currentEtapa][letra] != ' '){
                            $("#tabela tr").removeClass('currentetapa');
                            $(`.step_${currentEtapa} td.lugar`).addClass('verde');
                            $(`.step_${currentEtapa}`).addClass('currentetapa');
                            $(`.currentetapa td:first-child`).addClass('verde');
                            currentEtapa = alfabeto[currentEtapa][letra];
                        } else {
                            erro = true;
                            $(`.step_${currentEtapa}`).addClass('vermelho');
                        }
                    }

                    //Se for o ultimo, pressionando Espaço
                    if(acao == 32){
                        if(i == entrada.length-1){
                            if(alfabeto[currentEtapa]['end']){
                                $("#tabela tr").removeClass('currentetapa');
                                $(`.step_${currentEtapa}`).addClass('fim');
                                $(`.step_${currentEtapa}`).addClass('currentetapa');
                            } else {
                                erro = true;
                                $(`.step_${currentEtapa}`).addClass('vermelho');
                            }
                            input.val('');
                        }
                    }
                }
            }
        }
    }




}

