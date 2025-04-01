from PIL import Image

imagem = Image.open("./img/image.png")
imagem_redimensionada = imagem.resize((1080,1920))
imagem_redimensionada.save("icone_192.png")
