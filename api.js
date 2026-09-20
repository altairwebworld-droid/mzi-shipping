// Replace this adapter with a validated Supabase submission endpoint when configured.
// Never return delivered:true unless the backend confirms receipt.
export async function prepareEnquiry(data, files) {
  return {delivered:false,data:{...data,attachments:files.map(f=>({name:f.name,size:f.size,type:f.type}))}};
}
export async function lookupShipment() {return {available:false};}
