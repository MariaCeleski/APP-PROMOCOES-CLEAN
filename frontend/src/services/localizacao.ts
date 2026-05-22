import L from "leaflet";

// Função para buscar endereço pelo CEP usando ViaCEP
async function buscarEnderecoPorCEP(cep: string) {
  cep = cep.replace(/\D/g, "");
  if (cep.length !== 8) {
    alert("CEP inválido");
    return null;
  }

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  if (data.erro) {
    alert("CEP não encontrado");
    return null;
  }
  return data;
}

// Inicializa o mapa
const mapa = L.map("map").setView([-23.55052, -46.633308], 13); // São Paulo como default
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(mapa);

let marcador: L.Marker<any> | null = null;

// Atualiza o marcador no mapa
function atualizarMapa(lat: number, lng: number, endereco: string) {
  if (marcador) {
    mapa.removeLayer(marcador);
  }
  marcador = L.marker([lat, lng]).addTo(mapa).bindPopup(endereco).openPopup();
  mapa.setView([lat, lng], 16);
}

// Busca localização atual
function buscarEnderecoPorLocalizacao() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      atualizarMapa(lat, lng, "Minha localização atual");
    });
  } else {
    alert("Geolocalização não suportada");
  }
}

// Evento para buscar CEP
document.getElementById("buscarCep")?.addEventListener("click", async () => {
  const cepInput = (document.getElementById("cep") as HTMLInputElement).value;
  const endereco = await buscarEnderecoPorCEP(cepInput);
  if (endereco) {
    (document.getElementById("logradouro") as HTMLInputElement).value = endereco.logradouro;
    (document.getElementById("bairro") as HTMLInputElement).value = endereco.bairro;
    (document.getElementById("cidade") as HTMLInputElement).value = endereco.localidade;
    (document.getElementById("estado") as HTMLInputElement).value = endereco.uf;

    // Geocodificação simples usando Nominatim (OpenStreetMap)
    const query = `${endereco.logradouro}, ${endereco.localidade}, ${endereco.uf}`;
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const geoData = await geoResponse.json();
    if (geoData.length > 0) {
      const lat = parseFloat(geoData[0].lat);
      const lng = parseFloat(geoData[0].lon);
      atualizarMapa(lat, lng, query);
    }
  }
});

// Evento para localização atual
document.getElementById("usarLocalizacao")?.addEventListener("click", buscarEnderecoPorLocalizacao);
