function iniciar_jogo()
{
    
    $("#inicio").hide();

    $("#fundo").append("<div id=\"jogador\" class=\"anima1\"> </div>");
    $("#fundo").append("<div id=\"inimigo1\" class=\"anima2\"> </div>");
    $("#fundo").append("<div id=\"inimigo2\" > </div>");
    $("#fundo").append("<div id=\"amigo\" class=\"anima3\"> </div>");
    $("#fundo").append("<div id=\"placar\"> </div>");
    $("#fundo").append("<div id=\"vidas\"> </div>");



    var jogo = {};

    // enumeração das teclas de interação com o usuário
    var TECLAS = {W: 87, S: 83, ESPACO: 32 };
    var teclas_pressionadas = [];

    // velocidade e posição dos inimigos e amigos

    var velocidade_inimigo1 = 8;
    var velocidade_inimigo2 = 6;
    var velocidade_amigo = 1;
    var velocidade_tiro = 15;
    var posicao_y = (Math.random() * 334);
    
    // controle de pontos e vidas
    var pontos = 0;
    var amigos_salvos = 0;
    var amigos_perdidos = 0;
    var vidas_restantes = 3;

    // soms

    var som_disparo = document.getElementById("som_disparo");
    var som_explosao = document.getElementById("som_explosao");
    var som_musica = document.getElementById("som_musica");
    var som_gameover = document.getElementById("som_gameover");
    var som_perdido = document.getElementById("som_perdido");
    var som_resgate = document.getElementById("som_resgate");

    var jogo_finalizado = false;
    var tiro_disponivel = true;

    som_musica.addEventListener("ended", function(){ som_musica.currentTime = 0; som_musica.play(); }, false);
    som_musica.play();





    // verificar se alguma tecla foi pressionada pelo jogador

    $(document).keydown(function(tecla)
    {
        teclas_pressionadas[tecla.which] = true;
    });

    $(document).keyup(function(tecla)
    {
        teclas_pressionadas[tecla.which] = false;
    });




    // função callback e tempo de execução
    jogo.timer = setInterval(loop,30)

    function loop()
    {
        mover_fundo();
        mover_jogador();
        mover_inimigo1();
        mover_inimigo2();
        mover_amigo();
        verificar_colisao();
        placar();
        contar_vidas();
        
    }

    function mover_fundo()
    {
        
        let esquerda = parseInt($("#fundo").css("background-position"));
        $("#fundo").css("background-position",(esquerda-3));
        
        
    }


    function mover_jogador()
    {
        if(teclas_pressionadas[TECLAS.W])
        {
            let topo = parseInt($("#jogador").css("top"));
            
            if(topo-10>=0)
            {
                $("#jogador").css("top",topo-10);
            }

        }

        if(teclas_pressionadas[TECLAS.S])
        {
            let topo = parseInt($("#jogador").css("top"));
            

            if(topo+10<=434)
            {
                $("#jogador").css("top",topo+10);
            }
        }

        verificar_tiro();


    }

    function mover_inimigo1()
    {
        

        let esquerda = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left",esquerda-velocidade_inimigo1);
        $("#inimigo1").css("top",posicao_y);

        if(esquerda<=-50)
        {
            $("#inimigo1").css("left",694);
            posicao_y = (Math.random() * 334);
            $("#inimigo1").css("top",posicao_y);
        }


    }

    function mover_inimigo2()
    {
        let esquerda = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left",esquerda-velocidade_inimigo2);

        if(esquerda<=0)
        {
            $("#inimigo2").css("left",775);
        }

    }

    function mover_amigo()
    {
        let esquerda = parseInt($("#amigo").css("left"));
        $("#amigo").css("left",esquerda+velocidade_amigo);

        if(esquerda>=906)
        {
            $("#amigo").css("left",0);
        }
    }

    function verificar_tiro()
    {

        if(teclas_pressionadas[TECLAS.ESPACO])
        {
            
            
            if(tiro_disponivel)
            {
                som_disparo.play();
                tiro_disponivel = false;
                let topo_jogador = parseInt($("#jogador").css("top"));
                let esquerda_jogador =  parseInt($("#jogador").css("left"));
                let topo_tiro = topo_jogador+37;
                let esquerda_tiro = esquerda_jogador+190;
                $("#fundo").append("<div id=\"tiro\"> </div>");
                $("#tiro").css("top",topo_tiro);
                $("#tiro").css("left",esquerda_tiro);

                

                var mover_tiro = window.setInterval(movimentar_tiro,30);
                
            }


        }


        function movimentar_tiro()
        {
            let esquerda_tiro = parseInt($("#tiro").css("left"));
            //console.log("esquerda tiro: " + esquerda_tiro);
            if(esquerda_tiro>=900)
            {
                //console.log("eliminar tiro...");
                window.clearInterval(mover_tiro);
                mover_tiro = null;
                $("#tiro").remove();
                tiro_disponivel = true;
            }else{
                $("#tiro").css("left",esquerda_tiro+velocidade_tiro);
            }
        

        }   
        
    }

    

    function verificar_colisao()
    {
        // colisao do inimigo1 com o jogador
        var colisao_jogador_inimigo1 = ($("#jogador").collision($("#inimigo1")));

        if(colisao_jogador_inimigo1.length)
        {
            vidas_restantes--;
            let inimigo1_esquerda = ($("#inimigo1").css("left"));
            let inimigo1_topo =  ($("#inimigo1").css("top"));
            gerar_explosao(inimigo1_esquerda,inimigo1_topo);



            //reposionando inimigo1
            $("#inimigo1").css("left",694);
            posicao_y = (Math.random() * 334);
            $("#inimigo1").css("top",posicao_y);
        }

        // colisao do inimigo2 com o jogador

        var colisao_jogador_inimigo2 = ($("#jogador").collision($("#inimigo2")));

        if(colisao_jogador_inimigo2.length)
        {
            vidas_restantes--;
            let inimigo2_esquerda = ($("#inimigo2").css("left"));
            let inimigo2_topo =  ($("#inimigo2").css("top"));
            gerar_explosao2(inimigo2_esquerda,inimigo2_topo);


            $("#inimigo2").remove();

            reposicionar_inimigo2();

        }


        // colisao do tiro com o inimigo1

        var colisao_tiro_inimigo1 = ($("#tiro").collision($("#inimigo1")));

        if(colisao_tiro_inimigo1.length)
        {
            pontos+=100;
            let inimigo1_esquerda = ($("#inimigo1").css("left"));
            let inimigo1_topo =  ($("#inimigo1").css("top"));
            gerar_explosao(inimigo1_esquerda,inimigo1_topo);
            // colocando tiro fora da tela, para que ele seja eliminado e possibilite a criação
            // de novos tiros
            $("#tiro").css("left",950);


            //reposionando inimigo1
            $("#inimigo1").css("left",694);
            posicao_y = (Math.random() * 334);
            $("#inimigo1").css("top",posicao_y);

        }


        // colisao do tiro com o inimigo2
        var colisao_tiro_inimigo2 = ($("#tiro").collision($("#inimigo2")));

        if(colisao_tiro_inimigo2.length)
        {
            pontos+=50;
            let inimigo2_esquerda = ($("#inimigo2").css("left"));
            let inimigo2_topo =  ($("#inimigo2").css("top"));
            gerar_explosao2(inimigo2_esquerda,inimigo2_topo);
             // colocando tiro fora da tela, para que ele seja eliminado e possibilite a criação
            // de novos tiros
            $("tiro").css("left",950);

            $("#inimigo2").remove();

            reposicionar_inimigo2();
        }


        // colisao do jogador com o amigo
        var colisao_jogador_amigo = ($("#jogador").collision("#amigo"));

        if(colisao_jogador_amigo.length)
        {
            som_resgate.play();
            amigos_salvos++;
            reposicionar_amigo();
            $("#amigo").remove();
        }


        // colisão do amigo com o inimigo2

        var colisao_inimigo2_amigo = ($("#inimigo2").collision("#amigo"));

        if(colisao_inimigo2_amigo.length)
        {
            amigos_perdidos++;
            let esquerda = parseInt($("#amigo").css("left"));
            let topo = parseInt($("#amigo").css("top"));
            gerar_explosao3(esquerda,topo)
            $("#amigo").remove();


            reposicionar_amigo();

            
        }

    }


    function gerar_explosao(esquerda, topo)
    {
        som_explosao.play();
        $("#fundo").append("<div id=\"explosao1\"> </div>");
        $("#explosao1").css("background-image","url(imgs/explosao.png)");
        var div_explosao = $("#explosao1");
        div_explosao.css("top",topo);
        div_explosao.css("left",esquerda);
        div_explosao.animate({width:200, opacity:0},"slow");

        var duracao_explosao = setInterval(remover_explosao,1000)
        
        function remover_explosao()
        {
            div_explosao.remove();
            window.clearInterval(duracao_explosao);
            duracao_explosao = null;
        }

    }

    function gerar_explosao2(esquerda, topo)
    {
        som_explosao.play();
        $("#fundo").append("<div id=\"explosao2\"> </div>");
        $("#explosao2").css("background-image","url(imgs/explosao.png)");
        var div_explosao2 = $("#explosao2");
        div_explosao2.css("top",topo);
        div_explosao2.css("left",esquerda);
        div_explosao2.animate({width:200, opacity:0},"slow");

        var duracao_explosao = setInterval(remover_explosao2,1000)
        
        function remover_explosao2()
        {
            div_explosao2.remove();
            window.clearInterval(duracao_explosao);
            duracao_explosao = null;
        }

    }

    function reposicionar_inimigo2()
    {
        let duracao_desaparecimento_inimigo2 = window.setInterval(reposicionar,5000);

        function reposicionar()
        {
            window.clearInterval(duracao_desaparecimento_inimigo2);
            duracao_desaparecimento_inimigo2 = null;

            // se o jogo não foi finalizado, recriar o inimigo2 depois de 5 segundos;
            if(!jogo_finalizado)
            {   
                $("#fundo").append("<div id=\"inimigo2\"> </div>");
            }


        }

    }

    function reposicionar_amigo()
    {
        let duracao_desaparecimento_amigo = window.setInterval(reposicionar,6000);

        function reposicionar()
        {
            window.clearInterval(duracao_desaparecimento_amigo);
            duracao_desaparecimento_amigo = null;

            // se o jogo não foi finalizado, recriar o amigo depois de 6 segundos;
            if(!jogo_finalizado)
            {   
                $("#fundo").append("<div id=\"amigo\" class=\"anima3\"> </div>");
            }

        }

    }

    function gerar_explosao3(esquerda,topo)
    {
        som_explosao.play();
        $("#fundo").append("<div id=\"explosao3\" class=\"anima4\"> </div>");
        $("#explosao3").css("top",topo);
        $("#explosao3").css("left",esquerda);


        var duracao_explosao = window.setInterval(remover_explosao3,1000)
        
        function remover_explosao3()
        {
            $("#explosao3").remove();
            window.clearInterval(duracao_explosao);
            duracao_explosao = null;
        }


    }

    function placar()
    {
        $("#placar").html("<h2> Pontos: "+ pontos+ " Amigos Salvos: " + amigos_salvos+ " Amigos perdidos: " + amigos_perdidos + "</h2>" );
    }

    function contar_vidas()
    {
        switch(vidas_restantes)
        {
            case 3:
                $("#vidas").css("background-image","url(imgs/energia3.png)");
            break;
            case 2:
                $("#vidas").css("background-image","url(imgs/energia2.png)");
            break;
            case 1:
                $("#vidas").css("background-image","url(imgs/energia1.png)");
            break;
            case 0:
                som_perdido.play();
                game_over();
                $("#vidas").css("background-image","url(imgs/energia0.png)");
            break;
        }
    }


    
    function game_over()
    {
        jogo_finalizado = true;
        som_musica.pause();
        som_gameover.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();

        $("#fundo").append("<div id=\"final\"> </div>");
        $("#final").html("<h1> Game Over! </h1> <p>Pontuação final: " + pontos+"</p>  <div id=\"reiniciar\" onclick='reiniciar_jogo()'> <h3> Clique para reiniciar o jogo </h3> </div>");

    }

    
}


function reiniciar_jogo()
{
        console.log("chamou o reinicio");
        jogo_finalizado = false;
        som_gameover.pause();
        $("#final").remove();
        iniciar_jogo();
}
