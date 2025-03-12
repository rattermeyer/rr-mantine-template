workspace extends ./system-scope.dsl {

    model {

        !element chinook {
            web = container "Chinook Web App" "The Chinnok web app" {
                technology "React Router v7 Framework"
            }

            db = container "Database" {
                technology PostgreSQL
                tags "Database"
            }

            backend = container "Backend" {
                technology "Spring Boot"
                tags "backend,business api"
            }

            oidcProvider = container "OIDC Provider" {
                technology "dexidp"
                tags "oidc, oauth2, authn, authz"
            }

            web -> db "Gets data from"
            user -> oidcProvider "authenticates with"
            backend -> weatherProvider "fetches data from"
        }

        user -> web "uses"

        !element web {
            ui = component "Web UI" {
                technology "React, React Router"
                tags "WebApp"
            }
            back = component "UI Backend" {
                technology "React Router, Node"
            }

            ui -> back "interacts with"
            back -> oidcProvider "authenticates with"
            back -> backend "fetches data via"
        }

    }

    views {
        properties {
            c4plantuml.legend false
            c4plantuml.tags true
        }
        systemContext chinook "Chinook-Context" {
            include *
            autolayout lr
        }

        container chinook "Chinook-Container" {
            include *
            autolayout
        }

        component web "Component-WebApp" {
            include *
            autolayout
        }

        !include styles.dsl

    }

}
