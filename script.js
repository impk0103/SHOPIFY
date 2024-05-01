document.addEventListener("DOMContentLoaded", function() {
    const menButton = document.getElementById('b1');
    const womenButton = document.getElementById('b2');
    const kidsButton = document.getElementById('b3');

    menButton.addEventListener('click', function() {
        removeActiveClassFromButtons();
        this.classList.add('btn-active');
        fetchItemData('Men');
        addImageToButton(this, 'boy.svg');
    });

    womenButton.addEventListener('click', function() {
        removeActiveClassFromButtons();
        this.classList.add('btn-active');
        fetchItemData('Women');
        addImageToButton(this, 'girl.svg');
    });

    kidsButton.addEventListener('click', function() {
        removeActiveClassFromButtons();
        this.classList.add('btn-active');
        fetchItemData('Kids');
        addImageToButton(this, 'kid.svg');
    });

    function removeActiveClassFromButtons() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.classList.remove('btn-active');
            removeImageFromButton(button);
        });
    }

    menButton.click(); 

    function addImageToButton(button, imgSrc) {
        if (!button.querySelector('img')) {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.classList.add('image-active'); 
            button.prepend(img);
        }
    }

    function removeImageFromButton(button) {
        const img = button.querySelector('img');
        if (img) {
            img.remove();
        }
    }
});

async function fetchItemData(category) {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json');
        const data = await response.json();
        const categoryData = data.categories.find(cat => cat.category_name === category);

        for (let i = 0; i < categoryData.category_products.length; i++) {
            const product = categoryData.category_products[i];
            const cardIndex = i + 1;
            const cardSelector = `.card:nth-child(${cardIndex})`;

            document.querySelector(`${cardSelector} img[product-img-${cardIndex}]`).src = product.image;
            document.querySelector(`${cardSelector} p[badge-${cardIndex}]`).textContent = product.badge_text || '';
            document.querySelector(`${cardSelector} h3[product-title-${cardIndex}]`).textContent = truncateTitle(product.title);
            document.querySelector(`${cardSelector} span[vendor-name-${cardIndex}]`).textContent = product.vendor;
            document.querySelector(`${cardSelector} p[cost-${cardIndex}]`).textContent = `Rs ${product.price}.00`;
            document.querySelector(`${cardSelector} p[comparetocost${cardIndex}]`).textContent = `${product.compare_at_price}.00`;

            const price = parseFloat(product.price);
            const compareAtPrice = parseFloat(product.compare_at_price);
            const discount = ((compareAtPrice - price) / compareAtPrice) * 100;
            document.querySelector(`${cardSelector} p[discount-${cardIndex}]`).textContent = `${discount.toFixed(2)}% Off`;

            const badgeElement = document.querySelector(`${cardSelector} p[badge-${cardIndex}]`);
            if (product.badge_text) {
                badgeElement.classList.add('badgeactive');
            } else {
                badgeElement.classList.remove('badgeactive');
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function truncateTitle(title) {
    if (title.length > 12) {
        return title.slice(0, 12) + '..';
    } else {
        return title;
    }
}
