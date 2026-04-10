import { drupal } from "./drupal"

export async function fetchFilmMetadata(slug) {
  try {
    // 1. Fetch all film paths from Drupal
    // Same params as useFetchFilmsPaths: filter field_site_visible=1, fields path,drupal_internal__nid, limit 400, deserialize: false
    const pathsResponse = await drupal.getResourceCollection("node--film", {
      params: {
        "filter[field_site_visible]": 1,
        "fields[node--film]": "path,drupal_internal__nid",
        "page[limit]": 400,
      },
      deserialize: false,
    })

    if (!pathsResponse || !pathsResponse.data) {
      return null
    }

    // 2. Find the resource UUID matching the given slug (where node.attributes.path.alias === /${slug})
    const filmNode = pathsResponse.data.find(
      (node) => node.attributes?.path?.alias === `/${slug}`
    )

    if (!filmNode) {
      return null
    }

    const resourceId = filmNode.id

    // 3. Fetch that single film using drupal.getResource("node--film", id, ...)
    // Lightweight params: title, field_annees_de_sortie, field_site_thematique, field_site_collection, field_site_photogramme
    // include: field_site_thematique,field_site_photogramme
    const film = await drupal.getResource("node--film", resourceId, {
      params: {
        "fields[node--film]": "title,field_annees_de_sortie,field_site_thematique,field_site_collection,field_site_photogramme",
        include: "field_site_thematique,field_site_photogramme",
      },
    })

    if (!film) {
      return null
    }

    // 4. Extract data
    const title = film.title
    const year = film.field_annees_de_sortie
    
    // Thématique names (field_site_thematique is a relationship, each has .name after deserialization)
    const thematiques = film.field_site_thematique?.map((t) => t.name) || []
    
    // Photogramme image URL
    // after deserialization: film.field_site_photogramme.uri.url
    // build full URL: ${NEXT_PUBLIC_DRUPAL_BASE_URL.replace(/\/$/, '')}${uri.url}
    let imageUrl = null
    if (film.field_site_photogramme?.uri?.url) {
      const baseUrl = (process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "").replace(/\/$/, "")
      imageUrl = `${baseUrl}${film.field_site_photogramme.uri.url}`
    }

    return {
      title,
      year,
      thematiques,
      imageUrl,
    }
  } catch (error) {
    console.error("Error fetching film metadata:", error)
    return null
  }
}
