Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$source = [Drawing.Image]::FromFile((Join-Path $root 'convite.jpg'))
try {
  foreach ($height in @(1200,630)) {
    $canvas = [Drawing.Bitmap]::new(1200,$height)
    $graphics = [Drawing.Graphics]::FromImage($canvas)
    try {
      $graphics.Clear([Drawing.ColorTranslator]::FromHtml('#fce4ee'))
      $graphics.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $margin = 12
      $scale = [Math]::Min((1200-2*$margin)/$source.Width,($height-2*$margin)/$source.Height)
      $width = [int][Math]::Round($source.Width*$scale)
      $drawHeight = [int][Math]::Round($source.Height*$scale)
      $graphics.DrawImage($source,[int]((1200-$width)/2),[int](($height-$drawHeight)/2),$width,$drawHeight)
      $name = if ($height -eq 1200) { 'previa-quadrada.jpg' } else { 'previa-horizontal.jpg' }
      $encoder = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
      $parameters = [Drawing.Imaging.EncoderParameters]::new(1)
      $parameters.Param[0] = [Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality,[long]92)
      $canvas.Save((Join-Path $root $name),$encoder,$parameters)
      $parameters.Dispose()
      Write-Output "$name : 1200 x $height"
    } finally { $graphics.Dispose(); $canvas.Dispose() }
  }
} finally { $source.Dispose() }
