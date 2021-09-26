const form = document.getElementsByTagName('form')[0];
const msgDiv = document.getElementById('msg');
form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const myFile = document.getElementById('myFile');
    const data = new FormData();

    data.append('myFile', myFile.files[0]);
    await fetch('http://localhost:3000/unlimited-out-of-service', {
        method: 'POST',
        body: data,
    })
        .then(resp => {
            if (resp.ok) {
                msgDiv.innerText = 'FILE UPLOAD SUCCESS!';
            }
            else {
                msgDiv.innerText = 'Error!';
                throw new Error('Error! Status', resp.status);
            }
        })
        .catch(err => console.error(err));
});

