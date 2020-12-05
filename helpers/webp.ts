function support_format_webp()
{
  if(!process.browser) {
    return true
  }

 var elem = document.createElement('canvas');

 if (!!(elem.getContext && elem.getContext('2d')))
 {
  // was able or not to get WebP representation
  return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
 }
 else
 {
  // very old browser like IE 8, canvas not supported
  return false;
 }
}

let supported:boolean|null = null

export function supportWebp() {
  if(supported === null) {
    supported = support_format_webp()
  }

  return supported
}