workspace "Chinook System" "A sample web app and template" {
    model {
        chinook = softwareSystem "Chinook"
        user = person "User" {
            tags "Person"
        }
        weatherProvider = softwareSystem "Weather Data Provider" {
            tags "External"
        }
    }
}
