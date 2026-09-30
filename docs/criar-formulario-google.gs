function criarFormularioApoio() {
    const form = FormApp.create("Filadélfia Basquete - Apoio ao Projeto");

    form.setDescription(
        "Preencha seus dados para registrar seu interesse em apoiar o projeto Filadélfia Basquete."
    );
    form.setConfirmationMessage("Obrigado por apoiar o projeto Filadélfia Basquete!");

    form.addTextItem()
        .setTitle("Nome completo")
        .setRequired(true);

    form.addTextItem()
        .setTitle("E-mail")
        .setValidation(
            FormApp.createTextValidation()
                .requireTextIsEmail()
                .setHelpText("Informe um endereço de e-mail válido.")
                .build()
        )
        .setRequired(true);

    form.addTextItem()
        .setTitle("Telefone")
        .setHelpText("Opcional. Informe o DDD e o número.")
        .setRequired(false);

    form.addDateItem()
        .setTitle("Data de nascimento")
        .setRequired(false);

    form.addTextItem()
        .setTitle("Idade do aluno beneficiado (se aplicável)")
        .setValidation(
            FormApp.createTextValidation()
                .requireNumberBetween(10, 40)
                .setHelpText("Informe uma idade entre 10 e 40.")
                .build()
        )
        .setRequired(false);

    const responseSheet = SpreadsheetApp.create(
        "Respostas - Filadélfia Basquete - Apoio ao Projeto"
    );
    form.setDestination(FormApp.DestinationType.SPREADSHEET, responseSheet.getId());

    Logger.log("Link para responder: " + form.getPublishedUrl());
    Logger.log("Link para editar: " + form.getEditUrl());
    Logger.log("Planilha de respostas: " + responseSheet.getUrl());
}