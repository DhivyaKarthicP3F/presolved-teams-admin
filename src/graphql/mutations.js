/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateClientSignup = /* GraphQL */ `
  mutation UpdateClientSignup(
    $input: UpdateClientSignupInput!
    $condition: ModelClientSignupConditionInput
  ) {
    updateClientSignup(input: $input, condition: $condition) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const deleteClientSignup = /* GraphQL */ `
  mutation DeleteClientSignup(
    $input: DeleteClientSignupInput!
    $condition: ModelClientSignupConditionInput
  ) {
    deleteClientSignup(input: $input, condition: $condition) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const updateClientUsers = /* GraphQL */ `
  mutation UpdateClientUsers(
    $input: UpdateClientUsersInput!
    $condition: ModelClientUsersConditionInput
  ) {
    updateClientUsers(input: $input, condition: $condition) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteClientUsers = /* GraphQL */ `
  mutation DeleteClientUsers(
    $input: DeleteClientUsersInput!
    $condition: ModelClientUsersConditionInput
  ) {
    deleteClientUsers(input: $input, condition: $condition) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const createClientIntergrations = /* GraphQL */ `
  mutation CreateClientIntergrations(
    $input: CreateClientIntergrationsInput!
    $condition: ModelClientIntergrationsConditionInput
  ) {
    createClientIntergrations(input: $input, condition: $condition) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const updateClientIntergrations = /* GraphQL */ `
  mutation UpdateClientIntergrations(
    $input: UpdateClientIntergrationsInput!
    $condition: ModelClientIntergrationsConditionInput
  ) {
    updateClientIntergrations(input: $input, condition: $condition) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const deleteClientIntergrations = /* GraphQL */ `
  mutation DeleteClientIntergrations(
    $input: DeleteClientIntergrationsInput!
    $condition: ModelClientIntergrationsConditionInput
  ) {
    deleteClientIntergrations(input: $input, condition: $condition) {
      id
      tenantId
      mstenantId
      loginMS
      consentMS
      attributes
      createdAt
      updatedAt
    }
  }
`;
export const createClientUserWhitelisting = /* GraphQL */ `
  mutation CreateClientUserWhitelisting(
    $input: CreateClientUserWhitelistingInput!
    $condition: ModelClientUserWhitelistingConditionInput
  ) {
    createClientUserWhitelisting(input: $input, condition: $condition) {
      id
      tenantId
      groupId
      groupUser {
        id
        tenantId
        name
        description
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const updateClientUserWhitelisting = /* GraphQL */ `
  mutation UpdateClientUserWhitelisting(
    $input: UpdateClientUserWhitelistingInput!
    $condition: ModelClientUserWhitelistingConditionInput
  ) {
    updateClientUserWhitelisting(input: $input, condition: $condition) {
      id
      tenantId
      groupId
      groupUser {
        id
        tenantId
        name
        description
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const deleteClientUserWhitelisting = /* GraphQL */ `
  mutation DeleteClientUserWhitelisting(
    $input: DeleteClientUserWhitelistingInput!
    $condition: ModelClientUserWhitelistingConditionInput
  ) {
    deleteClientUserWhitelisting(input: $input, condition: $condition) {
      id
      tenantId
      groupId
      groupUser {
        id
        tenantId
        name
        description
        users {
          nextToken
        }
        createdAt
        updatedAt
      }
      displayName
      businessPhones
      givenName
      jobTitle
      mail
      mobilePhone
      officeLocation
      preferredLanguage
      surname
      userPrincipalName
      uid
      createdAt
      updatedAt
    }
  }
`;
export const updateClientCallLogs = /* GraphQL */ `
  mutation UpdateClientCallLogs(
    $input: UpdateClientCallLogsInput!
    $condition: ModelClientCallLogsConditionInput
  ) {
    updateClientCallLogs(input: $input, condition: $condition) {
      tenantId
      callRecordId
      callType
      callStartTime
      callEndTime
      callDuration
      charge
      callerNumber
      calleeNumber
      createdAt
      updatedAt
    }
  }
`;
export const deleteClientCallLogs = /* GraphQL */ `
  mutation DeleteClientCallLogs(
    $input: DeleteClientCallLogsInput!
    $condition: ModelClientCallLogsConditionInput
  ) {
    deleteClientCallLogs(input: $input, condition: $condition) {
      tenantId
      callRecordId
      callType
      callStartTime
      callEndTime
      callDuration
      charge
      callerNumber
      calleeNumber
      createdAt
      updatedAt
    }
  }
`;
export const createPresolvedAudit = /* GraphQL */ `
  mutation CreatePresolvedAudit(
    $input: CreatePresolvedAuditInput!
    $condition: ModelPresolvedAuditConditionInput
  ) {
    createPresolvedAudit(input: $input, condition: $condition) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const updatePresolvedAudit = /* GraphQL */ `
  mutation UpdatePresolvedAudit(
    $input: UpdatePresolvedAuditInput!
    $condition: ModelPresolvedAuditConditionInput
  ) {
    updatePresolvedAudit(input: $input, condition: $condition) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const deletePresolvedAudit = /* GraphQL */ `
  mutation DeletePresolvedAudit(
    $input: DeletePresolvedAuditInput!
    $condition: ModelPresolvedAuditConditionInput
  ) {
    deletePresolvedAudit(input: $input, condition: $condition) {
      id
      tenantId
      resource
      action
      byUser
      byDateTime
      changesMade
      createdAt
      updatedAt
    }
  }
`;
export const createClientUsersGroup = /* GraphQL */ `
  mutation CreateClientUsersGroup(
    $input: CreateClientUsersGroupInput!
    $condition: ModelClientUsersGroupConditionInput
  ) {
    createClientUsersGroup(input: $input, condition: $condition) {
      id
      tenantId
      name
      description
      users {
        items {
          id
          tenantId
          groupId
          displayName
          businessPhones
          givenName
          jobTitle
          mail
          mobilePhone
          officeLocation
          preferredLanguage
          surname
          userPrincipalName
          uid
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateClientUsersGroup = /* GraphQL */ `
  mutation UpdateClientUsersGroup(
    $input: UpdateClientUsersGroupInput!
    $condition: ModelClientUsersGroupConditionInput
  ) {
    updateClientUsersGroup(input: $input, condition: $condition) {
      id
      tenantId
      name
      description
      users {
        items {
          id
          tenantId
          groupId
          displayName
          businessPhones
          givenName
          jobTitle
          mail
          mobilePhone
          officeLocation
          preferredLanguage
          surname
          userPrincipalName
          uid
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteClientUsersGroup = /* GraphQL */ `
  mutation DeleteClientUsersGroup(
    $input: DeleteClientUsersGroupInput!
    $condition: ModelClientUsersGroupConditionInput
  ) {
    deleteClientUsersGroup(input: $input, condition: $condition) {
      id
      tenantId
      name
      description
      users {
        items {
          id
          tenantId
          groupId
          displayName
          businessPhones
          givenName
          jobTitle
          mail
          mobilePhone
          officeLocation
          preferredLanguage
          surname
          userPrincipalName
          uid
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createClientSignup = /* GraphQL */ `
  mutation CreateClientSignup(
    $input: CreateClientSignupInput!
    $condition: ModelClientSignupConditionInput
  ) {
    createClientSignup(input: $input, condition: $condition) {
      id
      name
      email
      phone
      company
      address
      city
      state
      zip
      country
      createdAt
      updatedAt
    }
  }
`;
export const createClientUsers = /* GraphQL */ `
  mutation CreateClientUsers(
    $input: CreateClientUsersInput!
    $condition: ModelClientUsersConditionInput
  ) {
    createClientUsers(input: $input, condition: $condition) {
      id
      tenantId
      name
      email
      role
      status
      createdAt
      updatedAt
    }
  }
`;
export const createClientCallLogs = /* GraphQL */ `
  mutation CreateClientCallLogs(
    $input: CreateClientCallLogsInput!
    $condition: ModelClientCallLogsConditionInput
  ) {
    createClientCallLogs(input: $input, condition: $condition) {
      tenantId
      callRecordId
      callType
      callStartTime
      callEndTime
      callDuration
      charge
      callerNumber
      calleeNumber
      createdAt
      updatedAt
    }
  }
`;
