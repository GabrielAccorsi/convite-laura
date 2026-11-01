param([ValidateSet('quadrada','horizontal')][string]$Formato = 'quadrada')
$root = Split-Path $PSScriptRoot -Parent
$path = Join-Path $root 'index.html'
$html = [IO.File]::ReadAllText($path)
$html = $html -replace 'previa-(quadrada|horizontal)\.jpg', "previa-$Formato.jpg"
$height = if ($Formato -eq 'quadrada') { '1200' } else { '630' }
$html = $html -replace 'property="og:image:height" content="\d+"', "property=`"og:image:height`" content=`"$height`""
[IO.File]::WriteAllText($path, $html, [Text.UTF8Encoding]::new($false))
Write-Output "Previa $Formato selecionada. Publique index.html para os robos lerem a alteracao."
