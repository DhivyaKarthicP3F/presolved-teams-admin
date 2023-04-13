/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPresolvedAudit = /* GraphQL */ `
  query GetPresolvedAudit($id: ID!) {
    getPresolvedAudit(id: $id) {
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
export const listPresolvedAudits = /* GraphQL */ `
  query ListPresolvedAudits(
    $filter: ModelPresolvedAuditFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPresolvedAudits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getClientSignup = /* GraphQL */ `
  query GetClientSignup($id: ID!) {
    getClientSignup(id: $id) {
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
export const listClientSignups = /* GraphQL */ `
  query ListClientSignups(
    $filter: ModelClientSignupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientSignups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getClientUsers = /* GraphQL */ `
  query GetClientUsers($id: ID!) {
    getClientUsers(id: $id) {
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
export const listClientUsers = /* GraphQL */ `
  query ListClientUsers(
    $filter: ModelClientUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        tenantId
        name
        email
        role
        status
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClientIntergrations = /* GraphQL */ `
  query GetClientIntergrations($id: ID!) {
    getClientIntergrations(id: $id) {
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
export const listClientIntergrations = /* GraphQL */ `
  query ListClientIntergrations(
    $filter: ModelClientIntergrationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientIntergrations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tenantId
        mstenantId
        loginMS
        consentMS
        attributes
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClientUserWhitelisting = /* GraphQL */ `
  query GetClientUserWhitelisting($id: ID!) {
    getClientUserWhitelisting(id: $id) {
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
export const listClientUserWhitelistings = /* GraphQL */ `
  query ListClientUserWhitelistings(
    $filter: ModelClientUserWhitelistingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientUserWhitelistings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        tenantId
        groupId
        groupUser {
          id
          tenantId
          name
          description
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
      nextToken
    }
  }
`;
export const getClientCallLogs = /* GraphQL */ `
  query GetClientCallLogs($callRecordId: ID!) {
    getClientCallLogs(callRecordId: $callRecordId) {
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
export const listClientCallLogs = /* GraphQL */ `
  query ListClientCallLogs(
    $callRecordId: ID
    $filter: ModelClientCallLogsFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listClientCallLogs(
      callRecordId: $callRecordId
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getClientUsersGroup = /* GraphQL */ `
  query GetClientUsersGroup($id: ID!) {
    getClientUsersGroup(id: $id) {
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
export const listClientUsersGroups = /* GraphQL */ `
  query ListClientUsersGroups(
    $filter: ModelClientUsersGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientUsersGroups(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
