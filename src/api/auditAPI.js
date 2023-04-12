import { API } from "aws-amplify";
import { createPresolvedAudit } from "../graphql/mutations";
import { listPresolvedAudits } from "../graphql/queries";

export async function createAuditRecord(auditRecord) {
  const auditDetails = {
    tenantId: auditRecord.tenantId,
    resource: auditRecord.resource,
    action: auditRecord.action,
    byUser: auditRecord.byUser,
    byDateTime: auditRecord.byDateTime,
    changesMade: auditRecord.changesMade,
  };
  console.log("auditDetails: ", auditDetails);
  const newAudit = await API.graphql({
    query: createPresolvedAudit,
    variables: { input: auditDetails },
  });
  console.log("newAudit: ", newAudit);
  return newAudit;
}

// list audit records with pagination
export async function listAuditRecords(filter, limit, nextToken) { 
  const variables = {
    filter: {
      tenantId: {
        eq: filter
      }
    },
    limit: limit, 
    nextToken: nextToken
  };
 
  const auditRecords = await API.graphql({
    query: listPresolvedAudits,
    variables: variables,
  });
  return auditRecords;
}
