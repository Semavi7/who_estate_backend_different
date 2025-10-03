using System.Collections.Generic;

namespace WhoEstate.API.Config
{
    public static class CategoryStructure
    {
        public static readonly Dictionary<string, Dictionary<string, string[]>> Structure = new Dictionary<string, Dictionary<string, string[]>>
        {
            {
                "Konut", new Dictionary<string, string[]>
                {
                    { "Satılık", new[] { "Daire", "Rezidans", "Müstakil Ev", "Villa", "Çiftlik Evi", "Köşk & Konak", "Yalı", "Yalı Dairesi", "Yazlık", "Kooperatif" } },
                    { "Kiralık", new[] { "Daire", "Rezidans", "Müstakil Ev", "Villa", "Çiftlik Evi", "Köşk & Konak", "Yalı", "Yalı Dairesi", "Yazlık" } },
                    { "Turistik Günlük Kiralık", new[] { "Daire", "Rezidans", "Müstakil Ev", "Villa", "Devre Mülk", "Apart & Pansiyon" } },
                    { "Devren Satılık Konut", new[] { "Daire", "Villa" } }
                }
            },
            {
                "İş Yeri", new Dictionary<string, string[]>
                {
                    { "Satılık", new[] { "Akaryakıt İstasyonu", "Apartman Dairesi", "Atölye", "Avm", "Büfe", "Büro Ofis", "Cafe & Bar", "Çiftlik", "Depo & Antrepo", "Düğün Salonu", "Dükkan ve Mağaza", "Enerji Santrali", "Fabrika & Üretim Tesisi", "Garaj & Park Yeri", "İmalathane", "İş Hanı Katı & Ofisi", "Kantin", "Kır & Kahvaltı", "Kıraathane", "Komple Bina", "Maden Ocağı", "Otopark/Garaj", "Oto Yıkama ve Kuaför", "PastaHane ve Fırın & Tatlıcı", "Pazar Yeri", "Plaza", "Plaza Katı & Ofisi", "Radyo İstasyonu & Tv Kanalı", "Restoran & Lokanta", "Rezidans Katı & Ofisi", "Sağlık Merkezi", "Sinema & Konferans Salonu", "SPA, Hamam & Sauna", "Spor Tesisi", "Villa", "Yurt" } },
                    { "Kiralık", new[] { "Akaryakıt İstasyonu", "Apartman Dairesi", "Atölye", "Avm", "Büfe", "Büro Ofis", "Cafe & Bar", "Çiftlik", "Depo & Antrepo", "Düğün Salonu", "Dükkan ve Mağaza", "Enerji Santrali", "Fabrika & Üretim Tesisi", "Garaj & Park Yeri", "İmalathane", "İş Hanı Katı & Ofisi", "Kantin", "Kır & Kahvaltı", "Kıraathane", "Komple Bina", "Maden Ocağı", "Otopark/Garaj", "Oto Yıkama ve Kuaför", "PastaHane ve Fırın & Tatlıcı", "Pazar Yeri", "Plaza", "Plaza Katı & Ofisi", "Radyo İstasyonu & Tv Kanalı", "Restoran & Lokanta", "Rezidans Katı & Ofisi", "Sağlık Merkezi", "Sinema & Konferans Salonu", "SPA, Hamam & Sauna", "Spor Tesisi", "Villa", "Yurt" } },
                    { "Devren Satılık", new[] { "Acente", "Akaryakıt İstasyonu", "Aktar &Bahatratçı", "Anaokulu ve Kreş", "Apartman Dairesi", "Araç Showroom & Servis", "Atölye", "AVM Standı", "Balıkçı", "Bar", "Bijuteri", "Börekçi", "Büfe", "Büro Ofis", "Cafe", "CD & DVD Dükkanı", "Cep Telefonu Dükkanı", "Çamaşırhane", "Çay Ocağı", "Çicekçi & Fidanlık", "Çiftlik", "Depo & Antrepo", "Düğün Salonu", "Dükkan & Mağaza", "Eczane & Medikal", "Elektrikçi & Hırdavatçı", "Elektronik Mağazası", "Etkinlik & Performans Salonu", "Fabrika & Üretim Tesisi", "Fatura Merkezi", "Fotoğraf Stüdyosu", "Gece Kulubü & Disko", "Giyim Mağazası", "Gözlükçü", "Halı Yıkama", "Huzur Evi", "İmalathane", "İnternet & Oyun Cafe", "İşhanı", "İş Hanı Katı & Ofisi", "Kantin", "Kasap", "Kır & Kahvaltı Bahçesi", "Kıraathane", "Kırtasiye", "Kozmatik Mağazası", "Kuaför & Güzellik Merkezi", "Kurs & Eğitim Merkezi", "Kuru Temizleme", "Kuruyemişçi", "Kuyumcu", "Lunapark", "Maden Ocağı", "Manav", "Market", "Matbaa", "Modaevi", "muayenehane", "Nakliyat & Kargo", "Nalbur", "Okul & Kurs", "Otopark/Garaj", "Oto Servis & Bakım", "Oto Yedek Parça", "Oto Yıkama & Kuaför", "Öğrenci Yurtd", "Pastahane, Fırın & Tatlıcı", "Pazar Yeri", "Pet Shop", "Plaza", "Plaza Katı & Ofisi", "Prova & Kayıt Stüdyosu", "Radyo İstasyonu & TV Kanalı", "Restoran & Lokanta", "Rezidans Katı & Ofisi", "Saat Mağazası", "Sağlık Merkezi", "Sebze & Meyve Hali", "Sinema & Konferans Salonu", "Soğuk Hava Deposu", "SPA, Hamam & Sauna", "Spor Tesisi", "Su & Tüp Bayi", "Şans Oyunları Bayisi", "Şarküteri", "Taksi Durağı", "Tamirhane", "Tekel Bayi", "Teknik Servis", "Terzi", "Tuhafiye", "Tuvalet", "Veteriner", "Züccaciye" } },
                    { "Devren Kiralık", new[] { "Acente", "Akaryakıt İstasyonu", "Aktar &Bahatratçı", "Anaokulu ve Kreş", "Apartman Dairesi", "Araç Showroom & Servis", "Atölye", "AVM Standı", "Balıkçı", "Bar", "Bijuteri", "Börekçi", "Büfe", "Büro Ofis", "Cafe", "CD & DVD Dükkanı", "Cep Telefonu Dükkanı", "Çamaşırhane", "Çay Ocağı", "Çicekçi & Fidanlık", "Çiftlik", "Depo & Antrepo", "Düğün Salonu", "Dükkan & Mağaza", "Eczane & Medikal", "Elektrikçi & Hırdavatçı", "Elektronik Mağazası", "Etkinlik & Performans Salonu", "Fabrika & Üretim Tesisi", "Fatura Merkezi", "Fotoğraf Stüdyosu", "Gece Kulubü & Disko", "Giyim Mağazası", "Gözlükçü", "Halı Yıkama", "Huzur Evi", "İmalathane", "İnternet & Oyun Cafe", "İşhanı", "İş Hanı Katı & Ofisi", "Kantin", "Kasap", "Kır & Kahvaltı Bahçesi", "Kıraathane", "Kırtasiye", "Kozmatik Mağazası", "Kuaför & Güzellik Merkezi", "Kurs & Eğiment Merkezi", "Kuru Temizleme", "Kuruyemişçi", "Kuyumcu", "Lunapark", "Maden Ocağı", "Manav", "Market", "Matbaa", "Modaevi", "muayenehane", "Nakliyat & Kargo", "Nalbur", "Okul & Kurs", "Otopark/Garaj", "Oto Servis & Bakım", "Oto Yedek Parça", "Oto Yıkama & Kuaför", "Öğrenci Yurtd", "Pastahane, Fırın & Tatlıcı", "Pazar Yeri", "Pet Shop", "Plaza", "Plaza Katı & Ofisi", "Prova & Kayıt Stüdyosu", "Radyo İstasyonu & TV Kanalı", "Restoran & Lokanta", "Rezidans Katı & Ofisi", "Saat Mağazası", "Sağlık Merkezi", "Sebze & Meyve Hali", "Sinema & Konferans Salonu", "Soğuk Hava Deposu", "SPA, Hamam & Sauna", "Spor Tesisi", "Su & Tüp Bayi", "Şans Oyunları Bayisi", "Şarküteri", "Taksi Durağı", "Tamirhane", "Tekel Bayi", "Teknik Servis", "Terzi", "Tuhafiye", "Tuvalet", "Veteriner", "Züccaciye" } }
                }
            },
            {
                "Arsa", new Dictionary<string, string[]>
                {
                    { "Kat Karşılığı Satılık", new string[0] },
                    { "Satılık", new string[0] },
                    { "Kiralık", new string[0] }
                }
            },
            {
                "Bina", new Dictionary<string, string[]>
                {
                    { "Satılık", new string[0] },
                    { "Kiralık", new string[0] }
                }
            },
            {
                "Devre Mülk", new Dictionary<string, string[]>
                {
                    { "Kiralık", new string[0] },
                    { "Satılık", new string[0] }
                }
            },
            {
                "Turistik Tesis", new Dictionary<string, string[]>
                {
                    { "Satılık", new[] { "Otel", "Apart Otel", "Butik Otel", "Motel", "Pansiyon", "Kamp Yeri", "Tatil Köyü" } },
                    { "Kiralık", new[] { "Otel", "Apart Otel", "Butik Otel", "Motel", "Pansiyon", "Kamp Yeri", "Tatil Köyü" } }
                }
            }
        };
    }
}