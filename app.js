const title = document.querySelector('#title');           // title input
const author = document.querySelector('#author');         // author input
const isbn = document.querySelector('#isbn');             // isbn input
const form = document.querySelector('form');              // form

const bookList = document.querySelector('#book-list');    // table
const deleteBtn = document.querySelector('.btn-danger');  // Delete button (Satirlar icin, her satir eklendiginde oradan gelen)
const searchBox = document.querySelector('.search');      // Search area


function createBook(title, author, isbn) {                // Kitap bilgilerini object mantigiyla yapti, bir object olusturduk
  return {      // Normalde buralari daha uzun bir sekilde yazilirdi bu yazim shorthand, yani key ve value ayni ise sadece bir tanesini yazabiliyoruz
    title,      // title: title;          
    author,     // author: author;         Orjinalleri bu sekilde
    isbn,       // isbn: isbn; 
  };
}

//Local Storage
let books;
if (localStorage.getItem('books')) {                      // Local Storage da veri varsa
  books = JSON.parse(localStorage.getItem('books'))       // "parse" ile json yapisini artik kullanilabilir bir hale (Javascript Object) donustorduk (Object-Array)
  books.forEach((book) => {                               // Takiben arrayin her elemanini yazidrdik hemen sayfa acilinca
    bookList.innerHTML += 
                            `<tr>
                            <td>${book.title}</td>  
                            <td>${book.author}</td>  
                            <td>${book.isbn}</td>
                            <td><button type="button" class="btn btn-danger">Delete</button></td>    
                            </tr>`
  })
} else {
  books = []                // Yoksa zaten array bos doner
}

form.addEventListener('submit', e => {
  e.preventDefault();                         // Oncelikle butonun submit ozelligi oldugu icin onun default islevini engelledik, ayrica her seferinde sayfayi refresh yapiyordu ve bizim verilerimizi siliyordu biz bunu istemedik
  const bookTitle = title.value;              // title value
  const bookAuthor = author.value;            // author title
  const bookIsbn = isbn.value;                // isbn value
  const book = createBook(bookTitle, bookAuthor, bookIsbn); // Iste burada da inputlardan aldigim bilgiler ve createBook() functiona gore bir object olusturdum (Object Olusturma - 3)
  // console.log(book);

  if (!(book.title && book.author && book.isbn)) {          // Burada ilgili inputlardan bir tanesi bile bos gelse "false" olsun ki diye && kullandik ve distaki "!" ile de true olsun ki alert versin
    alert('Check The form fields');
  } else {

    books.push(book)

    // Adding to Local Storage
    localStorage.setItem('books', JSON.stringify(books))    // Bu sekilde books arrayini JSON yapisinda Local Storage akledik

    // Add book Object to table, bu sekilde bir HTML yapisi kullanmak her daim avantaj olur, hem anlasilmasi hem de yazilmasi kolay
    bookList.innerHTML += `<tr>                             
                              <td>${book.title}</td>
                              <td>${book.author}</td>
                              <td>${book.isbn}</td>
                              <td><button type="button" class="btn btn-danger">Delete</button></td>
                           </tr>`;
  }

  // Burada eklenen her bir butona ulasabilmek icin bu sekilde de bir uygulama yapilabilirdi ama code optimization acisindan cok da uygun degil
  // Iste boyle olunca da butun buttonlar uzerinde addEventListener var ve peerformans acisindan cok da tercih edilen bir yontem degildir
  /*
  bookList.querySelectorAll('button').forEach(button => {     // Burada booklist alaninda calisiyoruz artik dedik, icindeki tum butonlari (Yani delete buttons) getirir, ve bir "Nodelist" (Array object olur array degil ama array fonskiyonlari kullanilabilir, HTML Collection donderenler array fonksiyonlarini kullanamazlar!) donderir
    button.addEventListener('click', e => {                   // Herbir butonun click oldugunda su fonksiyon eklensin ve calissin, ne olsun?
      e.target.closest('tr').remove();                        // !Butonun (parent tarafina dogru) gidildiginde en yakin tr tagini sil demek, o da zaten tum satiri siler
    });
  });
  */


  // title.value = '';      
  // bookTitle = '';    boyle kullanirsak silinmez cunku sadece ilgili veriyi bu degiskene atamis oluyoruz ve o degisken sifirlanir, input.value sifirlanmaz

  // Yukaridaki sekilde tek tek de yapilabilir, burasi bir form etiketi icinde oldugundan dolayi asagidaki gibi form.reset() seklinde de yapilabilir
  
  form.reset();   // form.reset() for etiketine ozgu bir methoddur

});

bookList.addEventListener('click', e => {           // Burada table click event (yani table da herhangi bir yere tiklanildiginda) aktif hale geldiginde calismasini istedigim olayi yaziyorum
  if (e.target.classList.contains('btn-danger')) {  // Eger table uzerinde tiklanan yer "Delete" butonu ise;
  
    // ! remove from localstorage
    const isbn = e.target.closest('tr').children[2].innerText;  // Basilan delete butonunun oldugu satirin unique isbn no sunu degiskene atadik
    books.forEach((book, index) => {                            // Yine tum arrayi indexleriyle birlikte donduk
      if (book.isbn === isbn) {                                 // Eger bu isbn ile eslesiyorsa
        books.splice(index, 1)                                  // Bir nevi onu sildik
        localStorage.setItem('books', JSON.stringify(books))    // Takiben o son halini tekrardan local storage attik
      }
    })
    
    // remove from ui
    e.target.closest('tr').remove();                  // Ekrandan sildik
  }
});

// ! Search Function Important !

searchBox.addEventListener('keyup', () => {           // Searchboxa bir event ekliyoruz ki klavyeden her tusa basildiginda su fonksiyon gerceklessin
  const searchKey = searchBox.value.toLowerCase();    // Input alanindan gelen veriyi kucuk harflere cevirerek bir degiskene atadik
  searchBook(searchKey);                              // Takiben bu degiskeni searchBook adinda bir fonksyiona arguman olarak verdik
});

const searchBook = key => {                           // searchBook arrow function, key parametresi
  const allBooks = bookList.querySelectorAll('tr');   // Table icerisindeki butun satirlara (tr) ulasabilmek maksatli, nodeList halinde donderdigini unutmayalim
  console.log(allBooks);                              // Nodelist oldugundan dolayi, array icin gecerli olan methodlari kullanabiliriz

  allBooks.forEach(book => {                          // Burada book table icerisindeki tr leri ifade ediyor
    // console.log(!book.children[0].innerText.toLowerCase().includes(key));
    if (!book.children[0].innerText.includes(key)) {  // Burada iste table icindeki tr in (4 adet td si var) ilk cocugu ki (Title td) iceriginde arama kelimesi(key) var mi?
      book.classList.add('hide');                     // Eger yoksa icerisi false olur ! ile de true olur ki, keyword olmadigindan satirin classlist ".hide" olur ve gosterilmez
    }
  });

  allBooks.forEach(book => {                          // Fakat tekrar silindiginde icinde olsa dahi gostermiyordu o hide class kaliyordu, dolayisiyla...
    // console.log(book.children[0].innerText.toLowerCase().includes(key));
    if (book.children[0].innerText.includes(key)) {   // Eger arama kelimesi title da varsa
      book.classList.remove('hide');                  // hide classini sil ki gozuksun !
    }
  });

};
