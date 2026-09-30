const GOOGLE_FORM_ID = "1wAE7v4_mG_bSGXzl2QvQ8IxBqi9QvWTA4RFIwAo0C2Q";

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

function doPost(event) {
    try {
        const values = event && event.parameter ? event.parameter : {};
        const name = (values.nome || "").trim();
        const email = (values.email || "").trim();
        const age = (values.idade || "").trim();

        if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error("Informe o nome e um e-mail válido.");
        }
        if (age && (!/^\d+$/.test(age) || Number(age) < 10 || Number(age) > 40)) {
            throw new Error("A idade do aluno deve estar entre 10 e 40.");
        }

        const form = FormApp.openById(GOOGLE_FORM_ID);
        const response = form.createResponse();
        const answers = {
            "Nome completo": name,
            "E-mail": email,
            "Telefone": (values.telefone || "").trim(),
            "Idade do aluno beneficiado (se aplicável)": age,
            "Caso afirmativo, qual a idade do aluno?": age
        };
        const birthDate = (values.nascimento || "").trim();

        form.getItems().forEach((item) => {
            if (item.getType() === FormApp.ItemType.DATE && item.getTitle() === "Data de nascimento") {
                if (/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
                    const [year, month, day] = birthDate.split("-").map(Number);
                    response.withItemResponse(
                        item.asDateItem().createResponse(new Date(year, month - 1, day))
                    );
                }
                return;
            }

            const value = answers[item.getTitle()];
            if (!value || item.getType() !== FormApp.ItemType.TEXT) {
                return;
            }

            response.withItemResponse(item.asTextItem().createResponse(value));
        });

        response.submit();
        return HtmlService.createHtmlOutput(
            "<p>Resposta enviada com sucesso. Obrigado por apoiar o projeto!</p>"
        ).setTitle("Resposta enviada");
    } catch (error) {
        console.error(error);
        return HtmlService.createHtmlOutput(
            "<p>Não foi possível enviar sua resposta. Verifique os campos ou tente novamente.</p>"
        ).setTitle("Falha no envio");
    }
}