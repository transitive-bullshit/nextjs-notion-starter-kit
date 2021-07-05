export const resizeCover = () =>  {
    var imgs = document.querySelectorAll("div.notion-collection-card-cover>img[src*='https://images.unsplash.com']");
    imgs.forEach(function(item) {
        item.src=item.src+"&fit=clip&w=640";
    });
    var imgs = document.querySelectorAll("img.notion-page-cover[src*='https://images.unsplash.com']");
    imgs.forEach(function(item) {
        item.src=item.src +"&fit=clip&w=1200";
    });
    console.log("image resizing on route changes.");
}