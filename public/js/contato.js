function validateForm() {
    var name = document.getElementById('name').value;
    if (name == "") {
        document.querySelector('.status').innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">O campo nome não pode estar vazio</div>";
        return false;
    }
    var email = document.getElementById('email').value;
    if (email == "") {
        document.querySelector('.status').innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">O campo e-mail não pode estar vazio</div>";
        return false;
    } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            document.querySelector('.status').innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">O e-mail precisa ser válido</div>";
            return false;
        }
    }
    var subject = document.getElementById('subject').value;
    if (subject == "") {
        document.querySelector('.status').innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">O campo assunto não pode estar vazio</div>";
        return false;
    }
    var message = document.getElementById('message').value;
    if (message == "") {
        document.querySelector('.status').innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">O campo mensagem não pode estar vazio</div>";
        return false;
    }
    document.querySelector('.status').innerHTML = "Enviando...";
}