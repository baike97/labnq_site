# ============================================================
# IMPORTAÇÕES
# ============================================================

import json
from pathlib import Path
from datetime import datetime

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


# ============================================================
# FUNÇÕES DE EXTRAÇÃO
# ============================================================

def extrair_tabela_recursos_humanos(soup):
    membros = {
        "pesquisadores": [],
        "estudantes": [],
        "tecnicos": []
    }

    container = soup.select_one("#recursosHumanos")

    if not container:
        print("ERRO: #recursosHumanos não encontrado.")
        return membros

    tabelas = container.find_all("table")

    for tabela in tabelas:

        # Cabeçalho da tabela
        headers = [
            th.get_text(" ", strip=True)
            for th in tabela.find_all("th")
        ]

        headers_texto = " ".join(headers).lower()

        # ----------------------------------------------------
        # PESQUISADORES
        # ----------------------------------------------------

        if (
            "pesquisadores" in headers_texto
            and "titulação máxima" in headers_texto
        ):
            categoria = "pesquisadores"

        # ----------------------------------------------------
        # ESTUDANTES
        # ----------------------------------------------------

        elif (
            "estudantes" in headers_texto
            and "nível de treinamento" in headers_texto
        ):
            categoria = "estudantes"

        # ----------------------------------------------------
        # TÉCNICOS
        # ----------------------------------------------------

        elif (
            "técnicos" in headers_texto
            and "formação acadêmica" in headers_texto
        ):
            categoria = "tecnicos"

        else:
            continue

        # ----------------------------------------------------
        # EXTRAÇÃO DAS LINHAS
        # ----------------------------------------------------

        tbody = tabela.find("tbody")

        if not tbody:
            continue

        linhas = tbody.find_all("tr")

        for linha in linhas:

            colunas = linha.find_all("td")

            if len(colunas) < 3:
                continue

            nome = colunas[0].get_text(" ", strip=True)
            titulacao = colunas[1].get_text(" ", strip=True)
            data_inclusao = colunas[2].get_text(" ", strip=True)

            if not nome:
                continue

            membros[categoria].append({
                "nome": nome,
                "titulacao": titulacao,
                "periodo": "",
                "data_inclusao": data_inclusao,
                "lattes": ""
            })

    return membros


# ============================================================
# PARTE PRINCIPAL
# ============================================================

def main():
    URL = "http://dgp.cnpq.br/dgp/espelhogrupo/73111"

    pasta_dados = Path("dados")
    pasta_dados.mkdir(exist_ok=True)

    print("Acessando DGP...")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True
        )

        page = browser.new_page()

        page.goto(
            URL,
            wait_until="domcontentloaded",
            timeout=60000
        )

        print("Página carregada.")
        print("URL atual:", page.url)

        # Pega o HTML
        html = page.content()

        # Salva HTML para debug
        arquivo_html = pasta_dados / "dgp_73111_debug.html"

        with open(
            arquivo_html,
            "w",
            encoding="utf-8"
        ) as arquivo:
            arquivo.write(html)

        # Cria o BeautifulSoup
        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        # Verifica se encontrou a seção
        container = soup.select_one("#recursosHumanos")

        if container:
            print("OK: seção #recursosHumanos encontrada.")
        else:
            print(
                "ERRO: seção #recursosHumanos NÃO encontrada."
            )

        # Extrai os membros
        membros = extrair_tabela_recursos_humanos(soup)

        # Monta o JSON
        dados = {
            "grupo": {
                "id": "73111",
                "nome": "Laboratório de Neuroquímica e Biologia Celular",
                "url": URL
            },

            "atualizado_em": datetime.now().isoformat(
                timespec="seconds"
            ),

            "total": {
                "pesquisadores": len(
                    membros["pesquisadores"]
                ),

                "estudantes": len(
                    membros["estudantes"]
                ),

                "tecnicos": len(
                    membros["tecnicos"]
                )
            },

            "pesquisadores": membros["pesquisadores"],
            "estudantes": membros["estudantes"],
            "tecnicos": membros["tecnicos"]
        }

        # Salva JSON
        arquivo_json = pasta_dados / "membros.json"

        with open(
            arquivo_json,
            "w",
            encoding="utf-8"
        ) as arquivo:
            json.dump(
                dados,
                arquivo,
                ensure_ascii=False,
                indent=4
            )

        browser.close()

    print()
    print("====================================")
    print("SCRAPER FINALIZADO")
    print("====================================")

    print(
        f"Pesquisadores: {len(membros['pesquisadores'])}"
    )

    print(
        f"Estudantes: {len(membros['estudantes'])}"
    )

    print(
        f"Técnicos: {len(membros['tecnicos'])}"
    )

    print()
    print(f"JSON gerado: {arquivo_json}")


# ============================================================
# EXECUÇÃO
# ============================================================

if __name__ == "__main__":
    main()
