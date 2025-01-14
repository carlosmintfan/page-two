var perPage = 3
  , prev = document.querySelector('#prev')
  , next = document.querySelector('#next');

page.base('/album');
page('/', '/photos/0');
page('/photos/:page', photos)
page('*', notfound);
page();

function photos(ctx) {
  var page = ~~ctx.params.page;
  var from = page * perPage;
  var to = from + perPage;
  console.log('showing page %s : %s..%s', page, from, to);
  var photos = images.slice(from, to);
  display(photos);
  adjustPager(page);
}

function notfound() {
  document.querySelector('p')
    .textContent = 'not found';
}

function display(photos) {
  var el = document.querySelector('#photos');
  el.innerHTML = '';
  photos.forEach(function(photo){
    var img = document.createElement('img');
    img.src = photo;
    el.appendChild(img);
  });
}

function adjustPager(page) {
  if (page) {
    prev.style.display = 'inline-block';
    prev.setAttribute('href', '/album/photos/' + (page - 1));
  } else {
    prev.style.display = 'none';
  }

  next.setAttribute('href', '/album/photos/' + (page + 1));
}

var images = [
  "https://images.unsplash.com/photo-1571566882372-1598d88abd90",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
  "https://images.unsplash.com/photo-1506755855567-92ff770e8d00",
  "https://images.unsplash.com/photo-1495360010541-f48722b34f7d",
  "https://images.unsplash.com/photo-1545249390-6bdfa286032f",
  "https://images.unsplash.com/photo-1504384558400-c1347a7bd18f",
  "https://images.unsplash.com/photo-1549545931-59bf067af9ab",
  "https://images.unsplash.com/photo-1479065476818-424362c3a854"
];
